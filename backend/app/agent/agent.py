from openai import OpenAI
from openai.types.responses import ResponseOutputItemDoneEvent, ResponseTextDeltaEvent, ResponseCompletedEvent
import json
from app.models.models import User
from app.core.config import settings
from app.agent.tools import tools
from app.agent.prompts import system_prompt, user_prompt


"""
==============================================================================
Todo:
    - Migrate to asyncio and asyncpg to run long queries asynchronously so
      tools can be made async?

    - Keep or remove the view_nutrients parameter in the get_meal_log_foods()
      tool?

    - Have agent generate a chat title based on the first message.

    - Fix update_message() for editing previous user messages.

    - Fix delete_message() so any related messages are deleted as well (e.g., 
      reasoning, tool calls, etc.).

    - Tools to create visualizations of data.

    - Allow the agent to create meals or workouts?
    
    - Allow the agent to set reminders? Possibly through emails/texts?

==============================================================================
"""

client = OpenAI(api_key=settings.openai_api_key)

async def generate_insight(user: User, user_message: str, newest_response_id: str):
    responses = []
    
    user_id = user.id

    instructions = system_prompt.get_system_prompt()
    prompt = user_prompt.get_user_prompt(user, user_message)
    previous_response_id = newest_response_id

    while True:
        stream = client.responses.create(
            input=prompt,
            instructions=instructions,
            max_output_tokens=5000,
            model="gpt-5-mini",
            previous_response_id=previous_response_id,
            stream=True,
            tools=tools.tools_list,
        )
            
        function_call_outputs = []

        for event in stream:
            if type(event) == ResponseOutputItemDoneEvent:
                if event.item.type == "function_call":
                    name = event.item.name
                    args = json.loads(event.item.arguments)

                    result = tools.call_function(name, args, user_id)
                    function_call_outputs.append({
                        "type": "function_call_output",
                        "call_id": event.item.call_id,
                        "output": json.dumps(result)
                    })

            elif type(event) == ResponseTextDeltaEvent:
                print(event.delta, end="", flush=True)

            elif type(event) == ResponseCompletedEvent:
                previous_response_id = event.response.id
                responses.append(event.response)

        if function_call_outputs:
            instructions = "Here are the outputs of the tools that you called."
            prompt = function_call_outputs
        else:
            print()
            break

    return responses

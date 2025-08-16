from openai import AsyncOpenAI
from agents import Agent, Runner, set_default_openai_client
from app.core.config import settings
from app.agent.memory import MemorySession
from app.agent.session_context import current_session
from app.agent.tools import tools
from app.agent.prompts import system_prompt


"""
==============================================================================
Todo:
    - Keep or remove the view_nutrients parameter in the get_meal_log_foods()
      tool?

    - Have agent generate a chat title based on the first message.

    - Fix update_message() for editing previous user messages.

    - Fix delete_message() so any related messages are deleted as well (e.g., 
      reasoning, tool calls, etc.).

    - Summarize older message groups to still keep some relevant context in
      the sliding window?

    - Tools to create visualizations of data.

    - Allow the agent to create meals or workouts?
    
    - Allow the agent to set reminders? Possibly through emails/texts?

==============================================================================
"""

custom_client = AsyncOpenAI(api_key=settings.openai_api_key)
set_default_openai_client(custom_client)

instructions = system_prompt.get_system_prompt()

agent = Agent(
        model="gpt-5-mini",
        name="AI fitness tracker assistant",
        instructions=instructions,
        tools=[tools.greet_user,
               tools.get_meal_log_summaries,
               tools.get_meal_log_food_summaries,
               tools.get_workout_log_summaries,
               tools.get_workout_log_exercise_summaries,
               tools.get_sleep_log_summaries,
               tools.get_mood_log_summaries,
               tools.get_weight_log_summaries]
)

class SessionRunner(Runner):
    @classmethod
    def run_streamed(cls, starting_agent: Agent, input: str, session: MemorySession, **kwargs):
        memory_session = current_session.set(session)
        try:
            return super().run_streamed(starting_agent=starting_agent, input=input, session=session, **kwargs)
        finally:
            current_session.reset(memory_session)

async def generate_insight(prompt: str, agent_memory: MemorySession):
    result = SessionRunner.run_streamed(starting_agent=agent,
                                        input=prompt,
                                        session=agent_memory)
    
    get_meal_log_summaries_call_id = ""
    get_meal_log_food_summaries_call_id = ""
    get_workout_log_summaries_call_id = ""
    get_workout_log_exercise_summaries_call_id = ""
    get_sleep_log_summaries_call_id = ""
    get_mood_log_summaries_call_id = ""
    get_weight_log_summaries_call_id = ""
    async for event in result.stream_events():
        if event.type == "run_item_stream_event":
            if event.name == "tool_called":
                if event.item.raw_item.name == "get_meal_log_summaries":
                    print("Getting meal logs...\n")
                    get_meal_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_meal_log_food_summaries":
                    print("Getting meal log foods...\n")
                    get_meal_log_food_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_workout_log_summaries":
                    print("Getting workout logs...\n")
                    get_workout_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_workout_log_exercise_summaries":
                    print("Getting workout log exercises...\n")
                    get_workout_log_exercise_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_sleep_log_summaries":
                    print("Getting sleep logs...\n")
                    get_sleep_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_mood_log_summaries":
                    print("Getting mood logs...\n")
                    get_mood_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_weight_log_summaries":
                    print("Getting weight logs...\n")
                    get_weight_log_summaries_call_id = event.item.raw_item.call_id

            elif event.name == "tool_output":
                if get_meal_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found meal logs.\n")
                    get_meal_log_summaries_call_id = ""

                elif get_meal_log_food_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found meal log foods.\n")
                    get_meal_log_food_summaries_call_id = ""

                elif get_workout_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found workout logs.\n")
                    get_workout_log_summaries_call_id = ""
                
                elif get_workout_log_exercise_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found workout log exercises.\n")
                    get_workout_log_exercise_summaries_call_id = ""

                elif get_sleep_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found sleep logs.\n")
                    get_sleep_log_summaries_call_id = ""

                elif get_mood_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found mood logs.\n")
                    get_mood_log_summaries_call_id = ""
                
                elif get_weight_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found weight logs.\n")
                    get_weight_log_summaries_call_id = ""

    return result

async def print_history(agent_memory: MemorySession):
    history = await agent_memory.get_items()
    print(f"\nhistory: {len(history)}")
    for i, item in enumerate(history):
        print(f"\nMessage {i+1}:")
        print(item)

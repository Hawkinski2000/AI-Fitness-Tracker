import asyncio
from openai import AsyncOpenAI
from agents import Agent, Runner, set_default_openai_client
from sqlalchemy.orm import Session
from app.core.db import get_db
import app.crud as crud
from app.core.config import settings
from app.agent.memory import MemorySession
from app.agent.tools import tools
from app.agent.prompts import system_prompt, user_prompt


"""
==============================================================================
Todo:    
    - Tools to create visualizations of data.

    - Allow the agent to create meals or workouts?
    
    - Allow the agent to set reminders? Possibly through emails/texts?

    - Store memory in the database instead of RAM.

==============================================================================
"""


custom_client = AsyncOpenAI(api_key=settings.openai_api_key)
set_default_openai_client(custom_client)

db_gen = get_db()
db: Session = next(db_gen)

user = crud.users.get_user(2, db)
system_prompt = system_prompt.get_system_prompt(user)
user_prompt = user_prompt.get_user_prompt(user)

agent = Agent(
        model="gpt-5",
        name="AI fitness tracker assistant",
        instructions="system_prompt",
        tools=[tools.greet_user,
               tools.get_meal_log_summaries,
               tools.get_meal_log_foods,
               tools.get_workout_log_summaries,
               tools.get_workout_log_exercises,
               tools.get_sleep_logs,
               tools.get_mood_logs,
               tools.get_weight_logs]
)

agent_memory = MemorySession(session_id="local-session")

async def generate_insight_async():
    result = Runner.run_streamed(agent,
                                 input=user_prompt,
                                 session=agent_memory)
    
    get_meal_log_summaries_call_id = ""
    get_meal_log_foods_call_id = ""
    get_workout_log_summaries_call_id = ""
    get_workout_log_exercises_call_id = ""
    get_sleep_logs_call_id = ""
    get_mood_logs_call_id = ""
    get_weight_logs_call_id = ""
    async for event in result.stream_events():
        if event.type == "run_item_stream_event":
            if event.name == "tool_called":
                if event.item.raw_item.name == "get_meal_log_summaries":
                    print("Getting meal logs...\n")
                    get_meal_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_meal_log_foods":
                    print("Getting meal log foods...\n")
                    get_meal_log_foods_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_workout_log_summaries":
                    print("Getting workout logs...\n")
                    get_workout_log_summaries_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_workout_log_exercises":
                    print("Getting workout log exercises...\n")
                    get_workout_log_exercises_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_sleep_logs":
                    print("Getting sleep logs...\n")
                    get_sleep_logs_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_mood_logs":
                    print("Getting mood logs...\n")
                    get_mood_logs_call_id = event.item.raw_item.call_id

                elif event.item.raw_item.name == "get_weight_logs":
                    print("Getting weight logs...\n")
                    get_weight_logs_call_id = event.item.raw_item.call_id

            elif event.name == "tool_output":
                if get_meal_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found meal logs.\n")
                    get_meal_log_summaries_call_id = ""

                elif get_meal_log_foods_call_id == event.item.raw_item.get("call_id"):
                    print("Found meal log foods.\n")
                    get_meal_log_foods_call_id = ""

                elif get_workout_log_summaries_call_id == event.item.raw_item.get("call_id"):
                    print("Found workout logs.\n")
                    get_workout_log_summaries_call_id = ""
                
                elif get_workout_log_exercises_call_id == event.item.raw_item.get("call_id"):
                    print("Found workout log exercises.\n")
                    get_workout_log_exercises_call_id = ""

                elif get_sleep_logs_call_id == event.item.raw_item.get("call_id"):
                    print("Found sleep logs.\n")
                    get_sleep_logs_call_id = ""

                elif get_mood_logs_call_id == event.item.raw_item.get("call_id"):
                    print("Found mood logs.\n")
                    get_mood_logs_call_id = ""
                
                elif get_weight_logs_call_id == event.item.raw_item.get("call_id"):
                    print("Found weight logs.\n")
                    get_weight_logs_call_id = ""

    print(result.final_output)
    
    return result.final_output

def generate_insight():
    return asyncio.run(generate_insight_async())

async def get_history_async():
    return await agent_memory.get_items()

def get_history():
    history = asyncio.run(get_history_async())
    for i, item in enumerate(history):
        print(f"\nMessage {i+1}:")
        print(item)

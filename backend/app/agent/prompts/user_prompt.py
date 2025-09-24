from app.models.models import User
from datetime import datetime


def get_user_prompt(user: User, user_message: str):
    return f"""
        Current User:
            Name: {user.first_name}  
            Sex: {user.sex}
            Age: {user.age}
            Weight: {user.weight}
            Height: {user.height}
            Goal: {user.goal}

        Date and Time: {datetime.now().isoformat()}

        User Message: {user_message}
    """

def get_generate_title_user_prompt(user_message: str):
    return f"""
        Generate a short title for this chat based on this first message from the user:

        "{user_message}"
    """

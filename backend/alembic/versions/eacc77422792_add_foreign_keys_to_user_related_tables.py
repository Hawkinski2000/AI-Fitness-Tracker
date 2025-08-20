"""Add foreign keys to user-related tables

Revision ID: eacc77422792
Revises: 838b876e936c
Create Date: 2025-08-19 18:58:01.377744

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eacc77422792'
down_revision: Union[str, Sequence[str], None] = '838b876e936c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add foreign keys to user-related tables."""
    op.create_foreign_key(None, 'exercise', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'food', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'insight_log', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'meal_log', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'message', 'chat', ['chat_id'], ['id'])
    op.create_foreign_key(None, 'mood_log', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'sleep_log', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'weight_log', 'user', ['user_id'], ['id'])
    op.create_foreign_key(None, 'workout_log', 'user', ['user_id'], ['id'])


def downgrade() -> None:
    """Remove foreign keys from user-related tables."""
    op.drop_constraint(None, 'workout_log', type_='foreignkey')
    op.drop_constraint(None, 'weight_log', type_='foreignkey')
    op.drop_constraint(None, 'sleep_log', type_='foreignkey')
    op.drop_constraint(None, 'mood_log', type_='foreignkey')
    op.drop_constraint(None, 'message', type_='foreignkey')
    op.drop_constraint(None, 'meal_log', type_='foreignkey')
    op.drop_constraint(None, 'insight_log', type_='foreignkey')
    op.drop_constraint(None, 'food', type_='foreignkey')
    op.drop_constraint(None, 'exercise', type_='foreignkey')

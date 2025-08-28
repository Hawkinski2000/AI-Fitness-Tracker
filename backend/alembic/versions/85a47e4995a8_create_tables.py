"""Create tables

Revision ID: 85a47e4995a8
Revises: 
Create Date: 2025-08-28 00:57:59.546623

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '85a47e4995a8'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('nutrient',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('unit_name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('password_hash', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('sex', sa.String(), nullable=False),
    sa.Column('age', sa.Integer(), nullable=False),
    sa.Column('weight', sa.Float(), nullable=False),
    sa.Column('height', sa.Integer(), nullable=False),
    sa.Column('goal', sa.String(), nullable=False),
    sa.Column('settings', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.Column('streak', sa.Integer(), server_default=sa.text('0'), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('input_tokens_remaining', sa.Integer(), server_default=sa.text('250000'), nullable=False),
    sa.Column('output_tokens_remaining', sa.Integer(), server_default=sa.text('3000'), nullable=False),
    sa.Column('last_token_reset', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('chat',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('newest_response_id', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('exercise',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('exercise_type', sa.String(), nullable=True),
    sa.Column('body_part', sa.String(), nullable=True),
    sa.Column('equipment', sa.String(), nullable=True),
    sa.Column('level', sa.String(), nullable=True),
    sa.Column('notes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.Column('base_unit', sa.String(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('user_created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('food',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('user_created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('insight_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('raw_text', sa.Text(), nullable=False),
    sa.Column('summary', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('meal_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('log_date', sa.Date(), nullable=False),
    sa.Column('total_calories', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('mood_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('log_date', sa.Date(), nullable=False),
    sa.Column('mood_score', sa.Integer(), nullable=True),
    sa.Column('notes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('sleep_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('log_date', sa.Date(), nullable=False),
    sa.Column('time_to_bed', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.Column('time_awake', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.Column('duration', sa.Integer(), nullable=False),
    sa.Column('sleep_score', sa.Integer(), nullable=True),
    sa.Column('notes', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('weight_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('log_date', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.Column('weight', sa.Float(), nullable=False),
    sa.Column('unit', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('workout_log',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('log_date', sa.Date(), nullable=False),
    sa.Column('workout_type', sa.String(), nullable=True),
    sa.Column('total_num_sets', sa.Integer(), server_default=sa.text('0'), nullable=False),
    sa.Column('total_calories_burned', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('branded_food',
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('brand_owner', sa.String(), nullable=True),
    sa.Column('brand_name', sa.String(), nullable=True),
    sa.Column('subbrand_name', sa.String(), nullable=True),
    sa.Column('ingredients', sa.String(), nullable=True),
    sa.Column('serving_size', sa.Float(), nullable=True),
    sa.Column('serving_size_unit', sa.String(), nullable=True),
    sa.Column('food_category', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['food_id'], ['food.id'], ),
    sa.PrimaryKeyConstraint('food_id')
    )
    op.create_table('food_nutrient',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('nutrient_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['food_id'], ['food.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['nutrient_id'], ['nutrient.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('insight',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('insight_log_id', sa.Integer(), nullable=False),
    sa.Column('insight', sa.Text(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('category', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['insight_log_id'], ['insight_log.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('meal_log_food',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('meal_log_id', sa.Integer(), nullable=False),
    sa.Column('food_id', sa.Integer(), nullable=False),
    sa.Column('meal_type', sa.String(), nullable=False),
    sa.Column('num_servings', sa.Float(), nullable=False),
    sa.Column('serving_size', sa.Float(), nullable=False),
    sa.Column('serving_unit', sa.String(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('calories', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['food_id'], ['food.id'], ),
    sa.ForeignKeyConstraint(['meal_log_id'], ['meal_log.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('meal_log_nutrient',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('meal_log_id', sa.Integer(), nullable=False),
    sa.Column('nutrient_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['meal_log_id'], ['meal_log.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['nutrient_id'], ['nutrient.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('chat_id', sa.Integer(), nullable=False),
    sa.Column('interaction_id', sa.Integer(), nullable=False),
    sa.Column('message', postgresql.JSONB(astext_type=sa.Text()), nullable=False),
    sa.Column('role', sa.String(), nullable=False),
    sa.Column('type', sa.String(), nullable=True),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['chat_id'], ['chat.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('workout_log_exercise',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workout_log_id', sa.Integer(), nullable=False),
    sa.Column('exercise_id', sa.Integer(), nullable=False),
    sa.Column('num_sets', sa.Integer(), server_default=sa.text('0'), nullable=False),
    sa.Column('greatest_one_rep_max', sa.Float(), nullable=True),
    sa.Column('unit', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['exercise_id'], ['exercise.id'], ),
    sa.ForeignKeyConstraint(['workout_log_id'], ['workout_log.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('exercise_set',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workout_log_exercise_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('weight', sa.Float(), nullable=True),
    sa.Column('reps', sa.Integer(), nullable=True),
    sa.Column('unit', sa.String(), nullable=True),
    sa.Column('one_rep_max', sa.Float(), nullable=True),
    sa.Column('rest_after_secs', sa.Integer(), nullable=True),
    sa.Column('duration_secs', sa.Integer(), nullable=True),
    sa.Column('calories_burned', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['workout_log_exercise_id'], ['workout_log_exercise.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('meal_log_food_nutrient',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('meal_log_food_id', sa.Integer(), nullable=False),
    sa.Column('nutrient_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.ForeignKeyConstraint(['meal_log_food_id'], ['meal_log_food.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['nutrient_id'], ['nutrient.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('meal_log_food_nutrient')
    op.drop_table('exercise_set')
    op.drop_table('workout_log_exercise')
    op.drop_table('message')
    op.drop_table('meal_log_nutrient')
    op.drop_table('meal_log_food')
    op.drop_table('insight')
    op.drop_table('food_nutrient')
    op.drop_table('branded_food')
    op.drop_table('workout_log')
    op.drop_table('weight_log')
    op.drop_table('sleep_log')
    op.drop_table('mood_log')
    op.drop_table('meal_log')
    op.drop_table('insight_log')
    op.drop_table('food')
    op.drop_table('exercise')
    op.drop_table('chat')
    op.drop_table('user')
    op.drop_table('nutrient')

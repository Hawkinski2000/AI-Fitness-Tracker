"""Make optional user fields nullable

Revision ID: 66059d3ad816
Revises: 85a47e4995a8
Create Date: 2025-08-30 16:55:02.311653

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '66059d3ad816'
down_revision: Union[str, Sequence[str], None] = '85a47e4995a8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('sleep_log', 'duration',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('user', 'first_name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('user', 'sex',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('user', 'age',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('user', 'weight',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=True)
    op.alter_column('user', 'height',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('user', 'goal',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('user', 'settings',
               existing_type=postgresql.JSONB(astext_type=sa.Text()),
               nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('user', 'settings',
               existing_type=postgresql.JSONB(astext_type=sa.Text()),
               nullable=False)
    op.alter_column('user', 'goal',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('user', 'height',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('user', 'weight',
               existing_type=sa.DOUBLE_PRECISION(precision=53),
               nullable=False)
    op.alter_column('user', 'age',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('user', 'sex',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('user', 'first_name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('sleep_log', 'duration',
               existing_type=sa.INTEGER(),
               nullable=False)

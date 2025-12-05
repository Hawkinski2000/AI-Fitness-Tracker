"""Make time awake and time asleep columns nullable

Revision ID: fc9533245e47
Revises: 59aff8013026
Create Date: 2025-12-05 02:21:22.490280

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'fc9533245e47'
down_revision: Union[str, Sequence[str], None] = '59aff8013026'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('sleep_log', 'time_to_bed',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True)
    op.alter_column('sleep_log', 'time_awake',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('sleep_log', 'time_awake',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False)
    op.alter_column('sleep_log', 'time_to_bed',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False)

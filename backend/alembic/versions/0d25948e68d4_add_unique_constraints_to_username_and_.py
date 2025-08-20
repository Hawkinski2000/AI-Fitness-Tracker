"""Add unique constraints to username and email

Revision ID: 0d25948e68d4
Revises: eacc77422792
Create Date: 2025-08-19 19:04:28.418892

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d25948e68d4'
down_revision: Union[str, Sequence[str], None] = 'eacc77422792'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add unique constraints to username and email."""
    op.create_unique_constraint(None, 'user', ['email'])
    op.create_unique_constraint(None, 'user', ['username'])


def downgrade() -> None:
    """Remove unique constraints from username and email."""
    op.drop_constraint(None, 'user', type_='unique')
    op.drop_constraint(None, 'user', type_='unique')

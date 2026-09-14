"""Add Watchlist and Alerts

Revision ID: 68519d856d7e
Revises: 598055d5f6b2
Create Date: 2026-09-05 12:51:47.407196

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "68519d856d7e"
down_revision: Union[str, Sequence[str], None] = "598055d5f6b2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    bind = op.get_bind()

    # ------------------------------------------------------------
    # WATCHLIST TYPE ENUM
    # ------------------------------------------------------------
    # This is a NEW enum for the watchlist table.
    # Create it only if it does not already exist.
    watchlist_type_enum = postgresql.ENUM(
        "STOLEN_VEHICLE",
        "BLACKLISTED_VEHICLE",
        "WANTED_PERSON",
        "MISSING_PERSON",
        "SUSPECT",
        name="watchlisttypeenum",
    )

    watchlist_type_enum.create(bind, checkfirst=True)

    # ------------------------------------------------------------
    # STATUS ENUM
    # ------------------------------------------------------------
    # statusenum already belongs to the original camera migration.
    # Therefore we MUST NOT create it here.
    status_enum = postgresql.ENUM(
        "ACTIVE",
        "INACTIVE",
        "MAINTENANCE",
        name="statusenum",
        create_type=False,
    )

    # ------------------------------------------------------------
    # WATCHLIST TABLE
    # ------------------------------------------------------------

    op.create_table(
        "watchlist",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "type",
            postgresql.ENUM(
                "STOLEN_VEHICLE",
                "BLACKLISTED_VEHICLE",
                "WANTED_PERSON",
                "MISSING_PERSON",
                "SUSPECT",
                name="watchlisttypeenum",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.Column(
            "identifier",
            sa.String(),
            nullable=False,
        ),
        sa.Column(
            "description",
            sa.String(),
            nullable=True,
        ),
        sa.Column(
            "status",
            status_enum,
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_watchlist_id"),
        "watchlist",
        ["id"],
        unique=False,
    )

    # ------------------------------------------------------------
    # ALERTS TABLE
    # ------------------------------------------------------------

    op.create_table(
        "alerts",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "timestamp",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column(
            "camera_id",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "watchlist_id",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "detection_class",
            sa.String(),
            nullable=True,
        ),
        sa.Column(
            "confidence",
            sa.Float(),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.String(),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["camera_id"],
            ["cameras.id"],
        ),
        sa.ForeignKeyConstraint(
            ["watchlist_id"],
            ["watchlist.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_alerts_id"),
        "alerts",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Remove alerts.
    op.drop_index(
        op.f("ix_alerts_id"),
        table_name="alerts",
    )

    op.drop_table("alerts")

    # Remove watchlist.
    op.drop_index(
        op.f("ix_watchlist_id"),
        table_name="watchlist",
    )

    op.drop_table("watchlist")

    # Do not remove statusenum.
    # It belongs to the original camera migration.

    # Remove watchlisttypeenum only if it exists.
    watchlist_type_enum = postgresql.ENUM(
        "STOLEN_VEHICLE",
        "BLACKLISTED_VEHICLE",
        "WANTED_PERSON",
        "MISSING_PERSON",
        "SUSPECT",
        name="watchlisttypeenum",
    )

    watchlist_type_enum.drop(op.get_bind(), checkfirst=True)
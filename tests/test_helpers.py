"""Unit tests for PlanPA helper utility logic."""
from datetime import datetime, timedelta
import math
import pytest


# ── Replicated helper logic (pure Python equivalents) ──────────────────────────

PRIORITY_COLORS = {
    "P1": "bg-red-500",
    "P2": "bg-orange-500",
    "P3": "bg-yellow-500",
    "P4": "bg-green-500",
}

STATUS_COLORS = {
    "Todo": "bg-gray-200 text-gray-700",
    "InProgress": "bg-blue-200 text-blue-700",
    "Completed": "bg-green-200 text-green-700",
    "Blocked": "bg-red-200 text-red-700",
}


def get_priority_color(priority: str) -> str:
    return PRIORITY_COLORS.get(priority, "bg-gray-500")


def get_status_color(status: str) -> str:
    return STATUS_COLORS.get(status, "bg-gray-200 text-gray-700")


def calculate_total_duration(tasks: list) -> int:
    return sum(t["estimatedDuration"] for t in tasks)


def split_task_into_blocks(duration_minutes: int, block_size: int = 40) -> int:
    return math.ceil(duration_minutes / block_size)


def add_minutes(dt: datetime, minutes: int) -> datetime:
    return dt + timedelta(minutes=minutes)


def is_today(dt: datetime) -> bool:
    return dt.date() == datetime.now().date()


def format_time(dt: datetime) -> str:
    return dt.strftime("%-I:%M %p") if hasattr(dt, 'strftime') else ""


# ── Tests ──────────────────────────────────────────────────────────────────────

class TestGetPriorityColor:
    def test_p1_returns_red(self):
        assert get_priority_color("P1") == "bg-red-500"

    def test_p2_returns_orange(self):
        assert get_priority_color("P2") == "bg-orange-500"

    def test_p3_returns_yellow(self):
        assert get_priority_color("P3") == "bg-yellow-500"

    def test_p4_returns_green(self):
        assert get_priority_color("P4") == "bg-green-500"

    def test_unknown_priority_returns_gray(self):
        assert get_priority_color("P5") == "bg-gray-500"

    def test_empty_string_returns_gray(self):
        assert get_priority_color("") == "bg-gray-500"

    def test_lowercase_not_matched(self):
        # Priority keys are uppercase — lowercase should fall back
        assert get_priority_color("p1") == "bg-gray-500"


class TestGetStatusColor:
    def test_todo_status(self):
        assert get_status_color("Todo") == "bg-gray-200 text-gray-700"

    def test_inprogress_status(self):
        assert get_status_color("InProgress") == "bg-blue-200 text-blue-700"

    def test_completed_status(self):
        assert get_status_color("Completed") == "bg-green-200 text-green-700"

    def test_blocked_status(self):
        assert get_status_color("Blocked") == "bg-red-200 text-red-700"

    def test_unknown_status_fallback(self):
        assert get_status_color("Unknown") == "bg-gray-200 text-gray-700"


class TestCalculateTotalDuration:
    def test_single_task(self):
        tasks = [{"estimatedDuration": 40}]
        assert calculate_total_duration(tasks) == 40

    def test_multiple_tasks(self):
        tasks = [
            {"estimatedDuration": 40},
            {"estimatedDuration": 60},
            {"estimatedDuration": 20},
        ]
        assert calculate_total_duration(tasks) == 120

    def test_empty_list(self):
        assert calculate_total_duration([]) == 0

    def test_single_minute_task(self):
        tasks = [{"estimatedDuration": 1}]
        assert calculate_total_duration(tasks) == 1

    def test_large_durations(self):
        tasks = [{"estimatedDuration": 480}, {"estimatedDuration": 480}]
        assert calculate_total_duration(tasks) == 960


class TestSplitTaskIntoBlocks:
    def test_exactly_one_block(self):
        # 40 minutes fits exactly into one 40-min block
        assert split_task_into_blocks(40) == 1

    def test_needs_two_blocks(self):
        # 41 minutes needs 2 blocks
        assert split_task_into_blocks(41) == 2

    def test_exactly_two_blocks(self):
        assert split_task_into_blocks(80) == 2

    def test_short_task_rounds_up(self):
        # 10 minutes still needs 1 block
        assert split_task_into_blocks(10) == 1

    def test_custom_block_size(self):
        assert split_task_into_blocks(60, block_size=30) == 2

    def test_large_task(self):
        # 200 minutes / 40 = 5 blocks
        assert split_task_into_blocks(200) == 5

    def test_one_minute_task(self):
        assert split_task_into_blocks(1) == 1


class TestAddMinutes:
    def test_add_40_minutes(self):
        base = datetime(2025, 11, 14, 9, 0, 0)
        result = add_minutes(base, 40)
        assert result == datetime(2025, 11, 14, 9, 40, 0)

    def test_add_5_minutes_break(self):
        base = datetime(2025, 11, 14, 9, 40, 0)
        result = add_minutes(base, 5)
        assert result == datetime(2025, 11, 14, 9, 45, 0)

    def test_add_minutes_crosses_hour(self):
        base = datetime(2025, 11, 14, 9, 50, 0)
        result = add_minutes(base, 20)
        assert result == datetime(2025, 11, 14, 10, 10, 0)

    def test_add_zero_minutes(self):
        base = datetime(2025, 11, 14, 9, 0, 0)
        assert add_minutes(base, 0) == base

    def test_add_minutes_crosses_midnight(self):
        base = datetime(2025, 11, 14, 23, 50, 0)
        result = add_minutes(base, 15)
        assert result == datetime(2025, 11, 15, 0, 5, 0)


class TestIsToday:
    def test_today_returns_true(self):
        assert is_today(datetime.now()) is True

    def test_yesterday_returns_false(self):
        yesterday = datetime.now() - timedelta(days=1)
        assert is_today(yesterday) is False

    def test_tomorrow_returns_false(self):
        tomorrow = datetime.now() + timedelta(days=1)
        assert is_today(tomorrow) is False

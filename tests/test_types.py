"""Tests for Planpa data model validation and type constraints."""
from datetime import datetime
import pytest


# ── Mirrors src/types.ts as Python dataclasses ─────────────────────────────────

VALID_PRIORITIES = {"P1", "P2", "P3", "P4"}
VALID_STATUSES = {"Todo", "InProgress", "Completed", "Blocked"}
VALID_BLOCK_TYPES = {"Work", "Break", "Buffer"}


def validate_task(task: dict) -> bool:
    required = ["taskId", "userId", "title", "priority", "estimatedDuration", "status"]
    for field in required:
        if field not in task:
            raise ValueError(f"Missing required field: {field}")
    if task["priority"] not in VALID_PRIORITIES:
        raise ValueError(f"Invalid priority: {task['priority']}")
    if task["status"] not in VALID_STATUSES:
        raise ValueError(f"Invalid status: {task['status']}")
    if task["estimatedDuration"] <= 0:
        raise ValueError("estimatedDuration must be positive")
    if not task["title"].strip():
        raise ValueError("title cannot be empty")
    return True


def validate_time_block(block: dict) -> bool:
    required = ["blockId", "scheduleId", "startTime", "endTime", "duration", "blockType"]
    for field in required:
        if field not in block:
            raise ValueError(f"Missing required field: {field}")
    if block["blockType"] not in VALID_BLOCK_TYPES:
        raise ValueError(f"Invalid blockType: {block['blockType']}")
    if block["endTime"] <= block["startTime"]:
        raise ValueError("endTime must be after startTime")
    if block["duration"] <= 0:
        raise ValueError("duration must be positive")
    return True


def validate_user(user: dict) -> bool:
    required = ["userId", "email", "name", "preferences"]
    for field in required:
        if field not in user:
            raise ValueError(f"Missing required field: {field}")
    if "@" not in user["email"]:
        raise ValueError("Invalid email format")
    prefs = user["preferences"]
    if prefs["defaultWorkDuration"] <= 0 or prefs["defaultBreakDuration"] <= 0:
        raise ValueError("Durations must be positive")
    return True


# ── Task validation tests ──────────────────────────────────────────────────────

class TestValidateTask:
    def make_task(self, **overrides):
        base = {
            "taskId": "t-001",
            "userId": "u-001",
            "title": "Write report",
            "description": "",
            "priority": "P1",
            "estimatedDuration": 40,
            "status": "Todo",
            "category": "work",
            "assignedBlockId": None,
            "createdAt": datetime.now(),
            "completedAt": None,
        }
        base.update(overrides)
        return base

    def test_valid_task_passes(self):
        assert validate_task(self.make_task()) is True

    def test_all_four_priorities_valid(self):
        for p in ["P1", "P2", "P3", "P4"]:
            assert validate_task(self.make_task(priority=p)) is True

    def test_invalid_priority_raises(self):
        with pytest.raises(ValueError, match="Invalid priority"):
            validate_task(self.make_task(priority="P5"))

    def test_all_statuses_valid(self):
        for s in ["Todo", "InProgress", "Completed", "Blocked"]:
            assert validate_task(self.make_task(status=s)) is True

    def test_invalid_status_raises(self):
        with pytest.raises(ValueError, match="Invalid status"):
            validate_task(self.make_task(status="Paused"))

    def test_zero_duration_raises(self):
        with pytest.raises(ValueError):
            validate_task(self.make_task(estimatedDuration=0))

    def test_negative_duration_raises(self):
        with pytest.raises(ValueError):
            validate_task(self.make_task(estimatedDuration=-10))

    def test_empty_title_raises(self):
        with pytest.raises(ValueError, match="title"):
            validate_task(self.make_task(title="   "))

    def test_missing_required_field_raises(self):
        task = self.make_task()
        del task["taskId"]
        with pytest.raises(ValueError, match="Missing required field"):
            validate_task(task)


# ── TimeBlock validation tests ─────────────────────────────────────────────────

class TestValidateTimeBlock:
    def make_block(self, **overrides):
        base = {
            "blockId": "b-001",
            "scheduleId": "s-001",
            "startTime": datetime(2025, 11, 14, 9, 0),
            "endTime": datetime(2025, 11, 14, 9, 40),
            "duration": 40,
            "blockType": "Work",
            "assignedTasks": [],
            "isCompleted": False,
        }
        base.update(overrides)
        return base

    def test_valid_work_block(self):
        assert validate_time_block(self.make_block()) is True

    def test_valid_break_block(self):
        assert validate_time_block(self.make_block(
            blockType="Break",
            endTime=datetime(2025, 11, 14, 9, 5),
            duration=5,
        )) is True

    def test_invalid_block_type_raises(self):
        with pytest.raises(ValueError, match="Invalid blockType"):
            validate_time_block(self.make_block(blockType="Lunch"))

    def test_end_before_start_raises(self):
        with pytest.raises(ValueError):
            validate_time_block(self.make_block(
                endTime=datetime(2025, 11, 14, 8, 0)
            ))

    def test_end_equals_start_raises(self):
        t = datetime(2025, 11, 14, 9, 0)
        with pytest.raises(ValueError):
            validate_time_block(self.make_block(startTime=t, endTime=t))

    def test_zero_duration_raises(self):
        with pytest.raises(ValueError):
            validate_time_block(self.make_block(duration=0))


# ── User validation tests ──────────────────────────────────────────────────────

class TestValidateUser:
    def make_user(self, **overrides):
        base = {
            "userId": "u-001",
            "email": "balaji@planpa.app",
            "name": "Balaji",
            "preferences": {
                "defaultWorkDuration": 40,
                "defaultBreakDuration": 5,
                "timezone": "Asia/Kolkata",
                "notifications": True,
            },
            "createdAt": datetime.now(),
        }
        base.update(overrides)
        return base

    def test_valid_user_passes(self):
        assert validate_user(self.make_user()) is True

    def test_invalid_email_raises(self):
        with pytest.raises(ValueError, match="email"):
            validate_user(self.make_user(email="notanemail"))

    def test_missing_preferences_raises(self):
        user = self.make_user()
        del user["preferences"]
        with pytest.raises(ValueError):
            validate_user(user)

    def test_zero_work_duration_raises(self):
        user = self.make_user()
        user["preferences"]["defaultWorkDuration"] = 0
        with pytest.raises(ValueError):
            validate_user(user)

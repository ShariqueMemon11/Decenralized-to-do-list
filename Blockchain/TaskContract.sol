// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskContract {
    struct Task {
        uint id;
        string text;
        bool completed;
        bool deleted;
        uint timestamp;
    }

    mapping(address => Task[]) public tasks;

    // Add a new task
    function addTask(string memory _text) public {
        tasks[msg.sender].push(Task({
            id: tasks[msg.sender].length,
            text: _text,
            completed: false,
            deleted: false,
            timestamp: block.timestamp
        }));
    }

    // Toggle completion status (true/false)
    function toggleTask(uint _id) public {
        require(_id < tasks[msg.sender].length, "Task does not exist");
        require(tasks[msg.sender][_id].deleted == false, "Task deleted");

        tasks[msg.sender][_id].completed = !tasks[msg.sender][_id].completed;
    }

    // Soft delete task (keeps history)
    function deleteTask(uint _id) public {
        require(_id < tasks[msg.sender].length, "Task does not exist");
        require(tasks[msg.sender][_id].deleted == false, "Already deleted");

        tasks[msg.sender][_id].deleted = true;
    }

    // Get only non-deleted tasks
    function getMyTasks() public view returns(Task[] memory) {
        uint count = 0;

        for (uint i = 0; i < tasks[msg.sender].length; i++) {
            if (tasks[msg.sender][i].deleted == false) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint index = 0;

        for (uint i = 0; i < tasks[msg.sender].length; i++) {
            if (tasks[msg.sender][i].deleted == false) {
                result[index] = tasks[msg.sender][i];
                index++;
            }
        }

        return result;
    }

    // Get deleted tasks history
    function getDeletedTasks() public view returns(Task[] memory) {
        uint count = 0;

        for (uint i = 0; i < tasks[msg.sender].length; i++) {
            if (tasks[msg.sender][i].deleted == true) {
                count++;
            }
        }

        Task[] memory result = new Task[](count);
        uint index = 0;

        for (uint i = 0; i < tasks[msg.sender].length; i++) {
            if (tasks[msg.sender][i].deleted == true) {
                result[index] = tasks[msg.sender][i];
                index++;
            }
        }

        return result;
    }
}

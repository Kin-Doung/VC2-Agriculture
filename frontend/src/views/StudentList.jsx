import React from 'react';
import StudentCard from '../components/StudentCard.jsx';

const students = [
  { id: 1, name: 'Alice', email: 'alice@example.com', score: 85 },
  { id: 2, name: 'Bob', email: 'bob@example.com', score: 92 },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', score: 78 },
];

export default function StudentList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </div>
  );
}

import React from 'react';

export default function StudentCard({ student }) {
  return (
    <div className="bg-white shadow-md rounded p-4">
      <h2 className="text-lg font-bold">{student.name}</h2>
      <p>Email: {student.email}</p>
      <p>Score: {student.score}</p>
    </div>
  );
}

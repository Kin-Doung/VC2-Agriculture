import React from 'react';
import StudentList from './views/StudentList';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <StudentList />
    </MainLayout>
  );
}

export default App;

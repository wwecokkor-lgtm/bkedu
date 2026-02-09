
import React from 'react';
import { Card, Button, Badge } from './commonComponents';
import type { Course } from './types';

interface CourseManagementViewProps {
    courses: Course[];
    onEdit: (c: Course) => void;
    onDelete: (c: Course) => void;
    onAdd: () => void;
}

const CourseManagementView: React.FC<CourseManagementViewProps> = ({ courses, onEdit, onDelete, onAdd }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Course Management</h2>
            <Button onClick={onAdd}>Add New Course</Button>
        </div>
        <Card className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-700">
                        <th className="p-3">Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id} className="border-b border-slate-800 hover:bg-slate-700/50">
                            <td className="p-3 flex items-center gap-3">
                                <img src={course.thumbnailUrl} alt={course.title} className="w-16 h-9 object-cover rounded"/>
                                {course.title}
                            </td>
                            <td className="p-3">{course.category}</td>
                            <td className="p-3">৳{course.price}</td>
                            <td className="p-3"><Badge color={course.publishStatus === 'Published' ? 'green' : 'yellow'}>{course.publishStatus}</Badge></td>
                            <td className="p-3 space-x-2">
                                <Button onClick={() => onEdit(course)} size="sm" variant="secondary">Edit</Button>
                                <Button onClick={() => onDelete(course)} size="sm" variant="danger">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
    </div>
);

export default CourseManagementView;

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
}

interface UsersProps {
    users: User[];
}

const Users: React.FC<UsersProps> = ({ users }) => (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
            <div className="flex space-x-2">
                <Button variant="outline" className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-user-plus mr-2"></i> Add User
                </Button>
                <Button className="!rounded-button whitespace-nowrap cursor-pointer">
                    <i className="fas fa-file-csv mr-2"></i> Upload CSV
                </Button>
            </div>
        </div>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                        <Button variant="outline" size="sm" className="text-rose-600 !rounded-button whitespace-nowrap cursor-pointer">
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
);

export default Users; 
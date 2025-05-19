import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UserType = ({ onSelect }) => {
  const userTypes = [
    {
      id: "admin",
      name: "Admin",
      description: "System administrator with full access"
    },
    {
      id: "government_officer",
      name: "Government Officer",
      description: "Officials from divisional secretariat or district level"
    },
    {
      id: "grama_sevaka",
      name: "Grama Sevaka",
      description: "Local village officers working with communities"
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          SignUp
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Your Role</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {userTypes.map((type) => (
            <div 
              key={type.id}
              className="flex flex-col items-start gap-2 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onSelect(type.id)}
            >
              <h3 className="font-semibold">{type.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserType;
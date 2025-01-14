//รายการแชทหน้าเว็บ

import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./component/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  //ฟังชั่นตามวีดีโอสอนมีปัญหา แก้ไขโดย AI Copilot
  //return (
  //  <Sidebar>
  //    <div className="h-full">
  //      <UserList items={users} />
  //      {children}
  //      </div>
  //  </Sidebar>
  //);

  if (!users) {
    // จัดการกรณีที่ `users` เป็น `undefined`
    return (
      <Sidebar>
        <div className="h-full">
          {" "}
          <p>No users found.</p>
          {children}
        </div>{" "}
      </Sidebar>
    );
  }
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}

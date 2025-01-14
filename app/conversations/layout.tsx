//การจัดการกรุ๊ปแชท

import getConversations from "../actions/getConversations";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import ConversationList from "./components/ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = (await getConversations()) || []; //แก้ไขโดย Chat GPT
  const users = (await getUsers()) || []; //แก้ไขโดย Chat GPT


  return (
    <Sidebar>
      <div className="h-full">
        <ConversationList
        users={users} 
        initialItems={conversations} 
        />
        {children}
      </div>
    </Sidebar>
  );
}

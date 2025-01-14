//api ข้อความในช่องแชท

import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    // รอการดึงข้อมูล user
    const currentUser = await getCurrentUser();
    
    // รอ params ให้เสร็จก่อนใช้
    const { conversationId } = await params; // เพิ่มการ await ที่นี่

    // ตรวจสอบว่าผู้ใช้มีสิทธิ์หรือไม่
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ตรวจสอบว่า conversationId ถูกส่งมาหรือไม่
    if (!conversationId) {
      return new NextResponse("Conversation ID is required", { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) {
      return new NextResponse("Invalid Conversation ID", { status: 400 });
    }

    // ดึงข้อความล่าสุด
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(conversation);  // ถ้าไม่มีข้อความให้ส่ง conversation กลับ
    }

    // อัปเดตสถานะ "seen" ของข้อความล่าสุด
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // ส่งการอัปเดตไปยังผู้ใช้
    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    // ตรวจสอบว่า currentUser ได้ดูข้อความหรือยัง
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(updatedMessage);  // ถ้าเห็นแล้วก็ส่งข้อความกลับ
    }

    // ส่งการอัปเดตข้อความให้กับทุกคนใน conversation
    await pusherServer.trigger(conversationId!, "messages:update", updatedMessage);

    return NextResponse.json(updatedMessage);  // ส่งข้อมูลข้อความที่อัปเดต
  } catch (error: any) {
    console.log("SEEN_ERROR_MESSAGE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}







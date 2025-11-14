import { authClient } from "@/lib/auth-client";
import type { ConversationResponse, QuestionWithMessages } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";

interface ChatHeaderProps {
  currentConversation: ConversationResponse | null;
  currentQuestion: QuestionWithMessages | null;
}

function ChatHeader({ currentConversation, currentQuestion }: ChatHeaderProps) {
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    navigate({ to: "/signin" });
  };

  // Get user initials for avatar
  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 py-0 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">
            {currentConversation?.name || "אין שיחה נבחרת"}
          </h3>
        </div>
        <div className="relative">
          {session && (
            <>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(session.user?.name)}
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {session.user?.name || "משתמש"}
                    </p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                    onKeyDown={(e) => e.key === "Escape" && setIsDropdownOpen(false)}
                    aria-label="Close dropdown"
                  />
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-9999">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {getUserInitials(session.user?.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {session.user?.name || "משתמש"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-right text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        פרופיל
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        התנתקות
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="w-full bg-linear-to-r from-indigo-500 to-purple-600 flex justify-center items-center py-2">
        <h3 className="text-white font-bold">
          {currentQuestion?.subject || "עדיין אין נושא לשיחה"}
        </h3>
      </div>
    </>
  );
}

export default ChatHeader;

import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Send, ArrowRight, MessageCircle, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  listing_id?: string
  content: string
  created_at: string
  read_at?: string
}

interface Conversation {
  participant_id: string
  participant_name: string
  last_message: string
  last_message_time: string
  unread_count: number
  listing_id?: string
  listing_title?: string
}

export default function Messages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return
    fetchConversations()
  }, [user])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  const fetchConversations = async () => {
    try {
      // Get all messages where user is sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          listings(title)
        `)
        .or(`sender_id.eq.${user!.id},receiver_id.eq.${user!.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group messages by conversation (other participant)
      const conversationsMap = new Map<string, Conversation>()
      
      data?.forEach((message) => {
        const otherUserId = message.sender_id === user!.id ? message.receiver_id : message.sender_id
        
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, {
            participant_id: otherUserId,
            participant_name: `משתמש ${otherUserId.slice(0, 8)}`,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user!.id && !message.read_at ? 1 : 0,
            listing_id: message.listing_id,
            listing_title: message.listings?.title
          })
        } else {
          const conv = conversationsMap.get(otherUserId)!
          if (message.receiver_id === user!.id && !message.read_at) {
            conv.unread_count++
          }
        }
      })

      setConversations(Array.from(conversationsMap.values()))
    } catch (error) {
      console.error('Error fetching conversations:', error)
      toast({
        title: "שגיאה בטעינת השיחות",
        description: "נסה לרענן את הדף",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (participantId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${user!.id})`)
        .order('created_at', { ascending: true })

      if (error) throw error

      setMessages(data || [])

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', participantId)
        .eq('receiver_id', user!.id)
        .is('read_at', null)

    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user!.id,
          receiver_id: selectedConversation,
          content: newMessage.trim()
        })

      if (error) throw error

      setNewMessage("")
      fetchMessages(selectedConversation)
      fetchConversations()

    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: "שגיאה בשליחת ההודעה",
        description: "נסה שוב",
        variant: "destructive"
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background rtl">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">יש להתחבר כדי לצפות בהודעות</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background rtl">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 hebrew-text">הודעות</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  שיחות ({conversations.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {loading ? (
                    <div className="p-4 text-center">טוען שיחות...</div>
                  ) : conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      אין עדיין שיחות
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.participant_id}
                          className={`p-4 cursor-pointer hover:bg-muted transition-colors border-b ${
                            selectedConversation === conversation.participant_id ? 'bg-muted' : ''
                          }`}
                          onClick={() => setSelectedConversation(conversation.participant_id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback>
                                <User className="w-5 h-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium truncate">
                                  {conversation.participant_name}
                                </h3>
                                {conversation.unread_count > 0 && (
                                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                                    {conversation.unread_count}
                                  </span>
                                )}
                              </div>
                              {conversation.listing_title && (
                                <p className="text-xs text-muted-foreground truncate">
                                  בנוגע ל: {conversation.listing_title}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.last_message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(conversation.last_message_time).toLocaleDateString('he-IL')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card className="lg:col-span-2">
              {selectedConversation ? (
                <>
                  <CardHeader>
                    <CardTitle>שיחה עם משתמש {selectedConversation.slice(0, 8)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 flex flex-col h-[500px]">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user.id ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender_id === user.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender_id === user.id 
                                  ? 'text-primary-foreground/70' 
                                  : 'text-muted-foreground'
                              }`}>
                                {new Date(message.created_at).toLocaleTimeString('he-IL', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="כתוב הודעה..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          dir="rtl"
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-[500px]">
                  <div className="text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                    <p>בחר שיחה כדי להתחיל לצ'טט</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
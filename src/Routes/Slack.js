import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import Menu from "../Components/Menu";
import { getChannelsListApi, getChatApi, getRepliesApi, url } from "../apiCalls/apiCalls";
import { BiArrowBack } from "react-icons/bi"
import { BiSolidUserCircle } from "react-icons/bi"
import "../CSS/Slack.css"
import SlackFile from "../Components/SlackFile";


let socket

export default function Slack({ notify, updateNotification, setNotification }){

    const [ channelsList, setChannelsList ] = useState([])
    const [ chats, setChats ] = useState({})
    const [ heading, setHeading ] = useState("Channels")
    const [ currentChannel, setCurrentChannel ] = useState("")
    const [ showThread, setShowThread ] = useState(false)
    const [ threadIndex, setThreadIndex ] = useState(-1)
    const [ textMessage, setTextMessage ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ userName, setUserName ] = useState("")
    const [ replies, setReplies ] = useState([])
    const [ events, setEvents ] = useState([])
    const [ unreadMessageCount, setUnreadMessageCount ] = useState(0)
    const [ scrollItemChannel, setScrollItemChannel ] = useState(null)
    const [ scrollItemMessage, setScrollItemMessage ] = useState(null)
    const [ showChannels, setShowChannels ] = useState(true)
    const [ members, setMembers ] = useState([])
    const [ channelNotification, setChannelNotification ] = useState(false)
    const [ memberNotification, setMemberNotification ] = useState(false)
    const scrollableRef = useRef(null);
    
    

    // async function sendSignal(){
    //     const res = await fetch("http://localhost:4005/test")
    // }
    
    function compareChannels(a, b) {
        if (a.read && !b.read) {
          return -1; // a comes before b
        }
        if (!a.read && b.read) {
          return 1; // b comes before a
        }
      
        // If both have the same read status or both are unread
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
      
        if (nameA < nameB) {
          return -1; // a comes before b
        }
        if (nameA > nameB) {
            return 1; // b comes before a
          }
          return 0; // names are equal
        }

    function checkNotificationBell(setNotificationBell, list){
        for(let i = 0; i < list.length; i++){
            if(list[i].read){
                setNotificationBell(true)
                return
            }
        }
        setNotificationBell(false)
    }

    async function getChannelsList(){
        const response = await getChannelsListApi()
        if(response.status === 200){
            setChannelsList(response.channelsList.sort(compareChannels))
            setUserId(response.userId)
            setUserName(response.userName)
            setMembers(response.membersList.sort(compareChannels))
            checkNotificationBell(setChannelNotification, response.channelsList)
            checkNotificationBell(setMemberNotification, response.membersList)
        }
        
    }

    async function getChat(id, privateChat){
        const response = await getChatApi(id, privateChat)
        setMembers((prev) => {
            const newMembers = [...prev]
            for(let i = 0; i < newMembers.length; i++){
                if(id === newMembers[i].id){
                    newMembers[i].conversationId = response.conversationId
                    break
                }
            }
            return newMembers
        })
        return response.status === 200 ? response.chat.reverse() : []
    }


    async function openChat(chatName, id, channel, privateChat){
        setScrollItemChannel(channel)
        setHeading(chatName)
        const chat = await getChat(id, privateChat)
        setChats((prev) => {
            const newChats = {...prev}
            newChats[chatName] = chat
            return newChats
        })
        setChannelsList((prev) => {
            const newChats = [...prev]
            for(let i = 0; i < newChats.length; i++){
                if(id === newChats[i].id){
                    newChats[i].read = false
                    break
                }
            }
            return newChats
        })
        setChannelsList(channelsList => channelsList.sort(compareChannels))
        setMembers((prev) => {
            const newChats = [...prev]
            for(let i = 0; i < newChats.length; i++){
                if(id === newChats[i].id){
                    newChats[i].read = false
                    break
                }
            }
            return newChats
        })
        setMembers(membersList => membersList.sort(compareChannels))
        setCurrentChannel(id)
        let unreadCount = 0
        for(let i = 0; i < chat.length; i++){
            if(chat[i].read){
                unreadCount++
            }
        }
        setUnreadMessageCount(unreadCount)
        
        
    }

    async function getReplies(ts, index, message){
        setScrollItemMessage(message)
        let conversationId = "CEMPTY"
        if(!scrollItemChannel.conversationId){
            for(let i = 0; i < members.length; i++){
                if(members[i].id === currentChannel){
                    conversationId = members[i].conversationId
                }
            }
        }
        else{
            conversationId = scrollItemChannel.conversationId
        }
        const res = conversationId === "CEMPTY" ? await getRepliesApi(currentChannel, ts, conversationId, showChannels) : await getRepliesApi(conversationId, ts, conversationId, showChannels)
        res.status === 200 && setChats((prev => {
            const newChat = {...prev}
            newChat[heading][index]["replies"] = res.chat
            return newChat
        }))
        setThreadIndex(index)
        setShowThread(true)
        
    }

    function goBack(){
        if(showThread){
            setShowThread(false)

        }
        else{
            
            

            const chatName = heading
            setChats((prev) => {
                const newChats = {...prev}
                if(newChats[chatName] && newChats[chatName].length){
                    for(let i = 0; i < newChats[chatName].length; i++){
                        newChats[chatName][i].read = false
                    }
                }
                return newChats
            })

            const channelName = heading

            setChannelsList((prev) => {
                const newList = [...prev]
                for(let i = 0; i < newList.length; i++){
                    if(channelName.includes(newList[i].name)){
                        newList[i].read = false
                    }
                }
                return newList.sort(compareChannels)
            })

            setMembers((prev) => {
                const newList = [...prev]
                for(let i = 0; i < newList.length; i++){
                    if(channelName.includes(newList[i].name)){
                        newList[i].read = false
                    }
                }
                return newList.sort(compareChannels)
            })
            

           
            if(chats[channelName] && chats[channelName].length){
                for(let i = 0; i < channelsList.length; i++){
                    if(channelName.includes(channelsList[i].name)){
                        socket.emit("markMessageAsRead", localStorage.getItem("email"), channelsList[i].id)
                    }
                }
            }

            
            setHeading("Channels")
            
            checkNotificationBell(setChannelNotification, channelsList)
            checkNotificationBell(setMemberNotification, members)
            

            
        }
    }

    async function sendMessage(e){
        e.preventDefault()
        const response = await fetch('https://worldtimeapi.org/api/ip');
        const data = await response.json();
    
        const datetime = response.ok ? new Date(data.datetime) : new Date()
        const unixTimestamp = datetime.getTime() / 1000;
        const formattedTimestamp = unixTimestamp.toFixed(6);

        
        if(showThread){
            socket.emit("postMessage", currentChannel, userId, textMessage, showThread, chats[heading][threadIndex].ts)
            setChats((prev) => {
                const newChats = {...prev}
                newChats[heading][threadIndex]["replies"].push({
                    user: userId,
                    username: userName,
                    text: textMessage,
                    ts: String(formattedTimestamp),
                    inserted: true
                })
                newChats[heading][threadIndex].replyCount += 1
                return newChats
            })
        }
        else{
            socket.emit("postMessage", currentChannel, userId, textMessage, showThread, "")
            setChats((prev) => {
                const newChats = {...prev}
                newChats[heading].push({
                    user: userId,
                    username: userName,
                    text: textMessage,
                    replyCount: 0,
                    ts: String(formattedTimestamp),
                    inserted: true,
                    replies: []
                })
                return newChats
            })
        }
        setTextMessage("")
    }

    function activate(){
        setShowChannels(true)
    }

    function deActivate(){
        setShowChannels(false)
    }

    useEffect(() => {

        if(heading === "Channels" && scrollableRef.current){
            if(showChannels){
                const channelScroll = channelsList.find(item => item && scrollItemChannel && item.id === scrollItemChannel.id);

                if (channelScroll && channelScroll.element) {
                // Scroll to the first read: true item
                    channelScroll.element.scrollIntoView();
                }
                setScrollItemChannel(null)
            }
            else{
                const memberScroll = members.find(item => item && scrollItemChannel && item.id === scrollItemChannel.id);

                if (memberScroll && memberScroll.element) {
                // Scroll to the first read: true item
                    memberScroll.element.scrollIntoView();
                }
                setScrollItemChannel(null)
            }
            
        }

    }, [heading])

    useEffect(() => {

        if(!showThread && scrollableRef.current && heading !== "Channels"){
            const channelScroll = chats[heading].find(item => item.ts === scrollItemMessage.ts);

            if (channelScroll && channelScroll.element) {
                // Scroll to the first read: true item
                channelScroll.element.scrollIntoView();
            }
            setScrollItemMessage(null)
        }

        

    }, [showThread])

    useEffect(() => {

        
        if(socket){
            socket.on("sendMessage", (eventData) => {
                
                console.log(eventData, "Received");
                
                for(let i = 0; i < events.length; i++){
                    if(events[i].ts === eventData.ts && events[i].channel === eventData.channel && events[i].text === eventData.text){
                        return
                    }
                }

                setEvents(prev => [...prev, eventData])

                
                setChannelsList((prev) => {
                    const newList = [...prev]
                    
                    for(let i = 0; i < newList.length; i++){
                        if(newList[i].id === eventData.channel){
                            
                            // if(newList[i].hasOwnProperty('tsList')){
                            //     for(let j = 0; j < newList[i].tsList.length; j++){
                            //         if(newList[i].tsList[j] === eventData.ts){
                            //             return newList
                            //         }
                            //     }
                            //     newList[i].tsList.push(eventData.ts)
                            // }
                            // else{
                            //     newList[i].tsList = []
                            // }
                            newList[i].read = true
                            return newList.sort(compareChannels)
                        }
                    }
                    return newList
                })

                if(eventData.channel && eventData.channel.startsWith("D")){
                    setMembers((prev) => {
                        const newList = [...prev]
                        for(let i = 0; i < newList.length; i++){
                            if(newList[i].id === eventData.user){
                                
                                // if(newList[i].hasOwnProperty('tsList')){
                                //     for(let j = 0; j < newList[i].tsList.length; j++){
                                //         if(newList[i].tsList[j] === eventData.ts){
                                //             return newList
                                //         }
                                //     }
                                //     newList[i].tsList.push(eventData.ts)
                                // }
                                // else{
                                //     newList[i].tsList = []
                                // }
                                newList[i].read = true
                                return newList.sort(compareChannels)
                            }
                        }
                        return newList
                    })
                }

                let channelName = ""

                
                
              
                for(let i = 0; i < channelsList.length; i++){
                    
                    if(channelsList[i].id === eventData.channel){
                        channelName = channelsList[i].name
                        if(channelsList[i].private){
                            channelName = '🔒 ' + channelName
                        }
                        else{
                            channelName = '\u00A0# ' + channelName
                        }
                        break
                    }
                }
                for(let i = 0; i < members.length; i++){
                    if(members[i].conversationId === eventData.channel){
                        channelName = members[i].name
                    }
                }
                if(channelName === ""){
                    console.log("Done");
                    return
                } 
                setChats((prev) => {
                    const newChats = {...prev}
                    if(!newChats[channelName]){
                        return newChats
                    }

                    if(eventData.thread_ts && showThread){
                        let index = -1
                        for(let i = 0; i < newChats[channelName].length; i++){
                            if(newChats[channelName][i].ts === eventData.thread_ts){
                                index = i
                                break
                            }
                        }
                        if(index === -1){
                            return newChats
                        }

                        if(newChats[channelName][index] && newChats[channelName][index]["replies"] && newChats[channelName][index]["replies"].length){

                        for(let i = newChats[channelName][index]["replies"].length - 1; i >= 0 && newChats[channelName][index]["replies"].length - 10; i--){
                            if(newChats[channelName][index]["replies"][i].ts === eventData.ts && newChats[channelName][index]["replies"][i].text === eventData.text){
                                return newChats
                            }
                            if(newChats[channelName][index]["replies"][i].inserted && newChats[channelName][index]["replies"][i].text === eventData.text){
                                newChats[channelName][index]["replies"][i].inserted = false
                                newChats[channelName][index]["replies"][i].ts = eventData.ts
                                return newChats
                            }
                        }
                        }
                        if(newChats[channelName] && newChats[channelName][index]){
                            newChats[channelName][index]["replies"].push({
                                replyCount: 0,
                                username: eventData.userName,
                                text: eventData.text,
                                ts: eventData.ts,
                            })
                        }
                        
                    }
                    else if(!eventData.thread_ts){
                        for(let i = newChats[channelName].length - 1; i >= 0 && newChats[channelName].length - 10; i--){
                            if(newChats[channelName][i].ts === eventData.ts && newChats[channelName][i].text === eventData.text){
                                return newChats
                            }
                            if(newChats[channelName][i].inserted && newChats[channelName][i].text === eventData.text){
                                newChats[channelName][i].inserted = false
                                newChats[channelName][i].ts = eventData.ts
                                return newChats
                            }
                        }
    
                        
    
                        
                        
                        newChats[channelName].push({
                            replyCount: 0,
                            username: eventData.userName,
                            text: eventData.text,
                            ts: eventData.ts,
                            replies: [],
                            scrollBottom: true
                        })
                    }

                    if(eventData.thread_ts){
                        for(let i = 0; i < replies.length; i++){
                            if(replies[i].channel === eventData.channel && replies[i].thread_ts === eventData.thread_ts && replies[i].ts === eventData.ts){
                                return newChats
                            }
                        }
                        setReplies((prev) => {
                            const newReplies = [...prev]
                            newReplies.push({
                                channel: eventData.channel,
                                thread_ts: eventData.thread_ts,
                                ts: eventData.ts
                            })
                            return newReplies
                        })
                        let index = -1
                        for(let i = 0; i < newChats[channelName].length; i++){
                            if(newChats[channelName][i].ts === eventData.thread_ts){
                                index = i
                                break
                            }
                        }
                        if(index === -1){
                            return newChats
                        }
                        newChats[channelName][index].replyCount += 1
                    }

                    
                    return newChats
                })
            })
        }


        if(scrollableRef.current && heading !== "Channels" && chats[heading]){
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
        }

        checkNotificationBell(setChannelNotification, channelsList)
        

        return () => {
            socket.off("sendMessage")
        }
    }, [channelsList, chats])

    useEffect(() => {
        checkNotificationBell(setMemberNotification, members)
    }, [members])

    useEffect(() => {
        if(scrollableRef.current && heading !== "Channels" && chats[heading] && chats[heading].length && chats[heading][chats[heading].length - 1].scrollBottom){
            scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
            setChats((prev) => {
                const newChat = {...prev}
                newChat[heading][chats[heading].length - 1].scrollBottom = false
                return newChat
            })
        }
    }, [chats])

    useEffect(() => {

        getChannelsList()

        socket = io("https://app.tutorly.com/"); 
        //socket.emit("joinChat", "chat");

        

        setNotification(false)

        
        
       
    }, [])

    function scrollToUnreadMessages(){
        if(scrollableRef.current && heading !== "Channels" && chats[heading]){
            const unreadMessage = chats[heading].find(item => item.read);

            

            if (unreadMessage) {
                // Scroll to the first read: true item
                unreadMessage.element.scrollIntoView({ behavior: 'smooth' });
            }
            setUnreadMessageCount(0)
        }
    }

    

    return <div className="slack">
        <Menu notify = {notify} updateNotification = {updateNotification} setNotification={setNotification} />
        <div className="channels-container">
            <h1>Slack</h1>
            <h2>
                {heading !== "Channels" && <div onClick={goBack} className="back-arrow"><BiArrowBack size={20} /></div>}
                {(!showChannels && heading === "Channels") ? "Members" : heading}
            </h2>
            
            <div ref={scrollableRef} className="channels">
                { heading !== "Channels" && !showThread && unreadMessageCount !== 0 && <button className="new-message-count" onClick={scrollToUnreadMessages}>{unreadMessageCount} New messages</button>}
                {
                    heading === "Channels" ?
                    showChannels ?
                    channelsList.map((channel, index) => {
                        return <p key={index} ref={(el) => (channel.element = el)} className={channel.read ? "channel-name channel-name-read" : "channel-name"} onClick={() => {openChat(`${channel.private ? '🔒': '\u00A0#'} ${channel.name}`, channel.id, channel, false)}} >{channel.private ? '🔒': '\u00A0\u00A0#\u00A0\u00A0'}   {channel.name} {channel.read && <div className="unread-dot"></div>}</p>
                    })
                    :
                    members.map((member, index) => {
                        return <div key={index} ref={(el) => (member.element = el)} className={member.read ? "channel-name-read member-div" :"member-div"} onClick={() => {openChat(member.name, member.id, member, true)}} >
                            <BiSolidUserCircle size={30} /> {member.name}
                            {member.read && <div className="unread-dot"></div>}
                            </div>
                    })
                    :
                    (
                        showThread ?
                        chats[heading] && chats[heading][threadIndex] && chats[heading][threadIndex]["replies"] ?
                        chats[heading][threadIndex]["replies"].map((message, index) => {
                            return <div key={index} className="message-div">
                            <p className="message-user-ts"><span className="message-user">{message.username}</span> <span className="message-ts">{(new Date(message.ts * 1000)).toLocaleDateString()} {(new Date(message.ts * 1000)).toLocaleTimeString()}</span></p>
                            <p className="message-text" dangerouslySetInnerHTML={{ __html: message.text }} />
                            {
                                message.files && message.files.length > 0 && 
                                message.files.map((file, index) => {
                                    return <div key={index} >
                                        <SlackFile file = {file} />
                                    </div>
                                })
                            }
                            </div>
                        })
                        :
                        <p>{chats[heading][threadIndex]}</p>

                        :
                        chats[heading] ?
                        chats[heading].map((message, index) => {
                            return <div ref={(el) => (message.element = el)} key={index} className="message-div">
                                {message.read && index !== 0 && !chats[heading][index - 1].read && <p className="new-message">new messages</p>}

                                <p className="message-user-ts">
                                    <span className="message-user">{message.username}</span> <span className="message-ts">{(new Date(message.ts * 1000)).toLocaleDateString()} {(new Date(message.ts * 1000)).toLocaleTimeString()}</span>
                                </p>
                                <p className="message-text" dangerouslySetInnerHTML={{ __html: message.text }} />
                                {
                                    message.files && message.files.length > 0 && 
                                    message.files.map((file, index) => {
                                        return <div key={index} >
                                            <SlackFile file = {file} />
                                        </div>
                                    })
                                }
                                <div className="replies-div">
                                <span className="reply-button" onClick={() => {getReplies(message.ts, index, message)}}>Reply</span>
                                
                                {message.replyCount > 0 && <span className="reply-button" onClick={() => {getReplies(message.ts, index, message)}}>{message.replyCount} {message.replyCount === 1 ? 'Reply' : 'Replies'}</span>}
                                </div>
                            </div>
                        })
                        :
                        <p>No Messages</p>
                    )
                }
            </div>
            {heading !== "Channels" ? <form className="message-form" onSubmit={sendMessage}>
                <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className="message-input" type="text" placeholder={showThread ? "Reply..." : "Type a message..."} required />
                <input className="message-send" type="submit" value = "Send" />
            </form> : 
            <div className="chat-select">
                <span className={showChannels ? "active" : "inactive"} onClick={activate}>Channels {channelNotification && <div className="unread-dot"></div>}</span>    
                <span className={showChannels ? "inactive" : "active"} onClick={deActivate}>Tutorly Members {memberNotification && <div className="unread-dot"></div>}</span>    
            </div>}
        </div>
    </div>
}
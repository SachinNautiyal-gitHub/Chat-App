

import React from 'react'
import {HStack, Avatar, Text} from "@chakra-ui/react"

function Message({text, uri, user = "other"}) {
  return (
     <HStack alignSelf={user === "me" ? "flex-end" : "flex-start"} bg={"gray.100"} borderRadius={'base'} paddingY={"2"} paddingX={"4"}>
        {
            user === "other" && <Avatar src={uri}/>
        }
     <Text>{text}</Text>
     {
        user === "me" && <Avatar src={uri}/>
     }
      
     </HStack>
  )
}

export default Message

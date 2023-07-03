import React, { useEffect, useRef, useState } from 'react'
import Message from './components/Message'

import {Box, Button, Container, VStack, HStack, Input} from '@chakra-ui/react'
import {app} from "./firebase"
import {getAuth, GoogleAuthProvider, signInWithPopup , onAuthStateChanged, signOut} from "firebase/auth"
import {getFirestore, addDoc, collection, serverTimestamp, onSnapshot, query, orderBy} from "firebase/firestore"


const auth = getAuth(app);
const db = getFirestore(app);


const loginHandler = () =>{
    const provider = new GoogleAuthProvider();
     signInWithPopup(auth, provider);
}


const logOutHandler =() =>{
  signOut(auth);
}





function App() {
  
  const[user , setUser] = useState(false);
  const [massage , setMassage] = useState("");
  const [massageArray , setMassageArray] = useState([]);

  const divForScroll = useRef(null);
  

  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"))


  const SubmitHandler = async(e) =>{
    e.preventDefault();
    
    try {
     await addDoc(collection(db, "Messages"), {
        text: massage,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp()  
     })

     setMassage("");
     divForScroll.current.scrollIntoView({
      behavior : "smooth"
     });
     
    } catch (error) {
     alert(error);
     
    }
 }




  useEffect(() =>{
   const unSubscribe = onAuthStateChanged(auth, (data) =>{
      setUser(data);
    });
   
    const unSubscribeforMsg=  onSnapshot(q, (snap) =>{
        setMassageArray(snap.docs.map(item => {
           const id = item.id;
           return { id, ...item.data()};
        }));
    })
  
    return ()=>{
      unSubscribe();
      unSubscribeforMsg();
    }

  },[])




  return (
    <Box bg={"green.100"}>
     {
      user ?(
        <Container bg={"white"} h={"100vh"}>
   
    <VStack h={"full"} paddingY={'4'} >
      <Button  onClick={logOutHandler} colorScheme='red' width={"full"} >Log-Out</Button>
      <VStack h={'full'} w={'full'} overflowY={"auto"} css={{"&::-webkit-scrollbar":{
        display: "none",
      }}}>
        {
          
          massageArray.map((item) =>(
             <Message key={item.id} user={item.uid === user.uid ?"me" : "other"} text={item.text} uri={item.uri}/>
          ))

        }
        
      <div ref={divForScroll}></div>
       
      </VStack>
      
   
     <form onSubmit={SubmitHandler} style={{width: "100%"}}>
     <HStack>

     <Input value={massage} onChange={(e)=> setMassage(e.target.value)} placeholder='Type your msg....'>

     </Input>
      <Button type='submit' bg={"green.500"}>Send</Button>

     </HStack>

     </form>

      
    </VStack>

  

    </Container>
      ): <VStack h={"100vh"} justifyContent={"center"}>
        
        <Button onClick={loginHandler} colorScheme='purple'>Sign In With Google </Button> 

      </VStack>
     }
    </Box>
  )
}

export default App

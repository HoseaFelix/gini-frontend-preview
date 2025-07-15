import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/store";

export default async function AuthCheck (){
    const router = useRouter()
    const token = useAuthStore((state)=>state.token)
    const setUser = useAuthStore((state)=>state.setUser)

    let res;

    try{
        if(token){
            res = await fetch ('https://aidgeny.onrender.com/api/auth/session', {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
        } else{
            res = await fetch('https://aidgeny.onrender.com/api/auth/session',{
                credentials: 'include'
            } )
        }

        if (!res.ok){
            return {
                success: false
            }
        }

        const user = await res.json()
        setUser(user.id, token)

        return {
            success: true,
            message: 'user athorized'
        }
    } catch(e){
        return {
            success: false,
            message: 'not authenticated'
        }
    }


}
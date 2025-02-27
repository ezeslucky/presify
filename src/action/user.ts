import { client } from "@/lib/prisma"
import { currentUser } from "@clerk/nextjs/server"


export const onAuthenticatedUser = async ()=>{
    try {
        const user = await currentUser()
        if(!user){
            return {status: 403}
        }

        const userExist = await client.user.findUnique({
            where:{
                cleckId: user.id
            },
            include: {
                PurchasedProjects:{
                   select:{
                    id: true,
                   }
                }
            }
        })

        if(userExist){
            return {Status: 200, user: userExist}
        }


        const newUser = await client.user.create({
            data:{
                cleckId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.firstName + " " + user.lastName,
                profileImage: user.imageUrl,

            }
        })

        if(newUser){
            return { status : 201, user: newUser}
        }

        return {status : 404 }
    } catch (error) {
        console.log("🚨  ERROR ", error)
        return {status: 500}
    }
}
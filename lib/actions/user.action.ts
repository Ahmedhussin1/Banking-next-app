'use server'

import path from "path";
import { createAdminClient, createSessionClient } from "../appwrite";
import {ID} from 'node-appwrite'
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

export const signIn = async ({email,password} : signInProps) =>{
    try {
        const {account} = await createAdminClient();
        const response = await account.createEmailPasswordSession(email,password)
        return parseStringify(response)
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

export const signUp = async (userData : SignUpParams) =>{
    const {email, password, firstName, lastName} = userData
    try {
        const {account} = await createAdminClient();
        const newUserAccount = await account.create(ID.unique(),email,password,`${firstName} ${lastName}`);

        const session = await account.createEmailPasswordSession(userData.email, userData.password)

        cookies().set("appwrite-session",session.secret,{
            path:'/',
            httpOnly:true,
            sameSite:"strict",
            secure:true,
        })
        return parseStringify(newUserAccount);
    } catch (error) {
        console.error('Error signing in:', error);
        throw error;
    }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();
    return parseStringify(result)
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () =>{
    try {
        const {account} = await createSessionClient();
        cookies().delete("appwrite-session")
        await account.deleteSession('current')
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}
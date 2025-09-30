import { createSlice } from "@reduxjs/toolkit";


type RootState = {
    user: {
      value: {
        name: string | null;
        email: string | null;
        access_token: string;
       
      };
    };
  };

const intialValue = {value:{
    name:null,
    email:null,
    access_token:"",
  
    
    
}}


export const userSlice=createSlice({
    name:"user",
    initialState:intialValue,
    reducers:{
        login:(state,action)=>{
            console.log(intialValue);
               state.value= action.payload 
               console.log(state.value);
               
           
        },
        logout:()=>{
            localStorage.removeItem('access_token_user')
            return intialValue
            
        }
    }
})

export const { login, logout } = userSlice.actions














import { createSlice } from "@reduxjs/toolkit";


type RootState = {
    admin: {
      value: {
        id: string | null;
        email: string | null;
        access_token: string;
        refresh_token:string;
      };
    };
  };

const intialValue = {value:{id:null,
    email:null,
    access_token:"",
   
    
}}


export const adminSlice=createSlice({
    name:"admin",
    initialState:intialValue,
    reducers:{
        login:(state,action)=>{
            console.log(intialValue);
               state.value= action.payload 
               console.log(state.value);
               
           
        },
        logout:()=>{
            localStorage.removeItem('access_token_admin'),
            localStorage.removeItem('refresh_token_admin')
            return intialValue
            
        }
    }
})

export const { login, logout } = adminSlice.actions














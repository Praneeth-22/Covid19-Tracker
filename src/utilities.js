export const sortData=(data)=>{
   const sorted=[...data]
   sorted.sort((a,b)=>{
      if(a.cases >b.cases){
         return -1
      }else{
         return 1;
      }
   })
   return sorted
}
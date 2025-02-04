const Users=[
    { 
    id:'1',
    name: 'John', 
    role: 'employee', 
    username: 'employee' ,
    },
    {
    id:2,
    name: 'Jane', 
    role: 'employee', 
    username: 'employee2',
    },
    {
    id:'3',
    name: 'Anil', 
    role: 'reviewer', 
    username: 'reviewer',
    },
    {
    id:4,
    name: 'Jane', 
    role: 'employee', 
    username: 'employee4',
    }
]
const addUser = (newUser) => {
    newUser.id = Users.length + 1; // Assign a new unique ID
    Users.push(newUser);
  };
  
  export { Users, addUser };
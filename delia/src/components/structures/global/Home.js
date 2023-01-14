import UsersList from '../games/UsersList';
import { User } from '../../../models/User';
import Anecdote from '../games/anecdotes/Anecdote';
import AnecdoteEditer from '../games/anecdotes/AnecdoteEditer';

export default function Home() {


  const userList = [];
  userList.push(new User(1, "user1"));
  userList.push(new User(2, "user2"));

  const handleChange = (id) => {
    return (e) => {
      console.log(id, e.target.value)
    }
  }

  const handleClick = (title, anecdote) => {
    console.log(title, anecdote);
  }

  return (
    <>
        <UsersList users={userList}/>

        <Anecdote users={userList} header={"Anecdote #1"} title={"title anecdote"} text={"Nisi ipsum quis commodo excepteur laborum elit ullamco sit."} handleChange={handleChange(1)}  />
        {/* <Anecdote users={userList} header={"Anecdote #2"} title={"title anecdote"} text={"Nisi ipsum quis commodo excepteur laborum elit ullamco sit."} handleChange={handleChange(2)}  /> */}
        <AnecdoteEditer saveAnecdote={handleClick} />

      
    
    </>
  );
}

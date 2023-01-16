import Table from 'react-bootstrap/Table';

function Home() {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>(anect title) <br/> name1</th>
          <th>(anect title) <br/> name2</th>
          <th>(anect title) <br/> name3</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>name 1</td>
          <td>rep 1</td>
          <td>rep 2</td>
          <td>rep 3</td>
        </tr>
        <tr>
          <td>name 2</td>
          <td>rep 1</td>
          <td>rep 2</td>
          <td>rep 3</td>
        </tr>
        <tr>
          <td>name 3</td>
          <td>rep 1</td>
          <td>rep 2</td>
          <td>rep 3</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default Home;
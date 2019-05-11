class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      'total_amount' : 1000,
      'amount' : 100,
      'email' : '',
    }
  }

onSubmit = async(event) =>{
  event.preventDefault();
  //alert(this.state.amount);
  const response = await axios.post('/post_info', {
    amount : this.state.amount,
    email : this.state.email
  })
  console.log(response);
}

  render(){
    return(
      <div>
      <h1>LOTTERY APPLICATION WEB 2.0</h1>
      <div>
      <p> Total Lottery amount is {this.state.total_amount} </p>
      </div>
      <form onSubmit={this.onSubmit}>
      <input placeholder="amount" value = {this.state.amount} onChange = {event=>this.setState({amount: event.target.value})}/>
      <input placeholder="email"  value = {this.state.email} onChange = {event=>this.setState({email: event.target.value})}/>
      <button type="submit" > Participate </button>
      </form>
      </div>
    )
  }
};

ReactDOM.render(
  <div>
    <App />
  </div>
, document.getElementById('reactBinding'));

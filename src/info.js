import React from 'react';
import icon from './icon.svg';



function len_dict(dict) 
{
    if (typeof(dict) !== 'object')
    {
        return 'the input is not a dictionary'
    }
    return Object.keys(dict).length
}

function TimeConvert(date) 
{
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    let time = new Date(date).toLocaleDateString("en-US", options)
    return time
}

function clean_str(string)
{
    let new_str = string.replace(/]|{|}|"|/g, '')
                        .replace('[', '')
                        .replace(/:/g, ': ')
                        .replace(/,/g, ', ')
                        
    return new_str
}



export class Data extends React.Component {  
    constructor(props) {
        super(props);
        this.state = { dict: [], index_selected: null,
                       key: '', value: '', field: '', message: '', data_screen: true
        };
    }

    async componentDidMount() {
        let URL = `http://localhost:8080/get_info_all`
        const response = await fetch(URL)
        const data = await response.json()
        this.setState({ dict: data})
    }

    myChangeHandler = (event) => {
        let nam = event.target.name;
        let val = event.target.value;
        this.setState({[nam]: val});
    }  

    mySubmitHandler = (event) => {
        event.preventDefault();
        this.get_data() 
    }

    async get_data() {

        if (this.state.key !== 'resource' && this.state.key !== 'category' &&
            this.state.key !== 'errors'   && this.state.key !== 'creation_date'
            && this.state.key !== '')
        {
            await this.setState({ message: 'the key is invalid', data_screen: false})
            return
        }

        if (this.state.field !== 'resource' && this.state.field !== 'category' &&
            this.state.field !== 'errors'   && this.state.field !== 'creation_date'
            && this.state.field !== '')
        {
            await this.setState({ message: 'the field is invalid', data_screen: false})
            return
        }
     
        else 
        {
            await this.setState({ message: '', data_screen: true})
        }
        
        let my_url = `http://localhost:8080/get_info?key=${this.state.key}&value=${this.state.value}&field=${this.state.field}`
        const response = await fetch(my_url)
        const data = await response.json()
        await this.setState({ dict:data })
    }

    render() {
        return (
            <div>                
                <form  className="center" onSubmit={this.mySubmitHandler}>                    
                    <br/>
                    <br/>
                    key :   <input type='text' name='key' onChange={this.myChangeHandler}/>
                    <p></p>
                    value : <input type='text' name='value' onChange={this.myChangeHandler}/>                   
                    <p></p>
                    field : <input type='text' name='field' onChange={this.myChangeHandler}/>                    
                    <p></p>
                    <button type="submit" >GET</button>                    
                </form>
                
            {
                this.state.data_screen === true
                ?
                    <div className="all_info">
                        
                        <h3 className="total_header">{len_dict(this.state.dict)} Total </h3>
                        {this.state.dict.map((data, row_index) => {
                            return (
                                <div>
                                    <div className="title" onClick={ () => {
                                            if (this.state.index_selected === row_index)
                                            {
                                                this.setState({index_selected: null})
                                            }
                                            else
                                            {
                                                this.setState({index_selected: row_index})
                                            }
                                        }}
                                    >
                                        <div className="grid-container">
                                            <div className="grid-item"> {data.resource} </div>
                                            <div className="grid-item"> {data.category} </div>
                                            <div className="grid-item"> {TimeConvert(Number(data.creation_date))} </div> 
                                            <div className="grid-item_end"> {data.errors} </div>  
                                        </div>
                                    </div>
                                    
                                    {
                                        data.hasOwnProperty('details') 
                                        ?                                
                                        this.state.index_selected === row_index &&
                                            <div className="content">
                                                <div className="details">
                                                    <p><b>Severity: </b>{data.details.severity}</p>
                                                    <p><b>Status: </b> {data.details.status}</p>
                                                    <p><b>Tags:</b>  {clean_str(JSON.stringify(data.details.tags))}</p>
                                                </div>
                                            </div> 
                                        :
                                        this.state.index_selected === row_index &&
                                            <div className="content">
                                                <div className="details">   
                                                    <img className="img" src={icon}/>
                                                </div>
                                            </div>                                 
                                    } 
                                </div>
                            );
                        })}
                    </div>
                :
                <p className="center" >{this.state.message}</p>
            }
                
            </div>

        )  
    }
}
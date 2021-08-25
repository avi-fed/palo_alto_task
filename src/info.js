import React from 'react';
import icon from './icon.svg';


function clean_str(string)
{
    let new_str = string.replace(/]|{|}|"|/g, '').replace('[', '').replace(/:/g, ': ').replace(/,/g, ', ')
    return new_str
}

function TimeConvert(date) 
{
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    let time = new Date(date).toLocaleDateString("en-US", options)
    return time
}

function len_dict(dict) 
{
    if (typeof(dict) !== 'object')
    {
        return 'the input is not a dictionary'
    }
    return Object.keys(dict).length
}



export class Data extends React.Component {  
    constructor(props) {
        super(props);
        this.state = { dict: [], index_selected: null};
    }

    async componentDidMount() {
        let URL = `http://localhost:8080/get_info`
        const response = await fetch(URL)
        const data = await response.json()
        this.setState({ dict: data})
    }
    
    render() {
        return (
            <div>
                <p></p>
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
                                        <div className="grid-item">{data.resource}</div>
                                        <div className="grid-item">{data.category}</div>
                                        <div className="grid-item">{TimeConvert(Number(data.creation_date))}</div> 
                                        <div className="grid-item_end">{data.errors}</div>  
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
                                                <img className="center_img" src={icon}/>
                                            </div>
                                        </div>                                 
                                } 
                            </div>
                        );
                    })}
                </div>
            </div>
        )  
    }
}
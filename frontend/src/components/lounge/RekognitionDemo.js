import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Amplify, { API } from 'aws-amplify';
import Webcam from "react-webcam";

class RekognitionDemo extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef()
        this.state = {
            screenshot: null,
            labels: null,
            loading: false
        }
    }

    componentDidMount() {
    }

    capture = () => {

        const screenshot = this.webcamRef.current.getScreenshot();
        this.setState({ screenshot }, () => {
            toast.success("Captured!");
            this.postImage();
        });
    }

    async postImage() {
        // call a demo API here
        this.setState({ loading: true });
        const res = await API.post("vrlearning","/demo/rekognition", {
            body: {
                image: this.state.screenshot
            }
        });
        this.setState({ loading: false });

        if (res !== null) {
            this.setState({ labels: res.Labels });
        }
        else {
            toast.error("something wrong! try again.");
        }
    }

    render() {

        const videoConstraints = {
            width: 650,
            height: 520,
            facingMode: "user"
        };

        return (
            <div>
                <br></br>
                <h1 className="text-secondary text-center">Object Detection with AWS Rekognition</h1>
                <br></br>
                <ToastContainer position="bottom-right" autoClose="3000" />

                <div className="container">
                    <div className="row">
                        <div className="col-8">

                            <div className="text-center">
                            <Webcam
                                ref={this.webcamRef}
                                audio={false}
                                height={520}
                                screenshotFormat="image/png"
                                width={650}
                                videoConstraints={videoConstraints}
                            />
                            
                                <br/><br/>
                                <button id="buttonSnapshot" className="btn btn-primary mr-2" onClick={this.capture}>Take A Snapshot</button>
                                <br/>
                            
                            </div>
                            {this.state.loading ? <h1>Loading...</h1> : <h1>&nbsp;</h1>}
                        </div>

                        {this.state.labels && 
                        <div className="col-4">
                            <div>
                                <h5>Found objects : </h5>
                            </div>
                            <div className="container">
                                <table className="table">
                                <tr className="thead-light">
                                    <th>Label</th>  
                                    <th>Confidence</th>
                                </tr>
                                {this.state.labels.map(( label, index) => {
                                    return (
                                    <tr key={index}>
                                        <td>{ label.Name }</td>
                                        <td>{ label.Confidence }</td>
                                    </tr>
                                );
                                })}
                                </table>
                            </div>
                        </div>
                        }   
                    </div>
                </div>

            </div>
        );
    }
}

export default RekognitionDemo;
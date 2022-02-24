import React, { Component } from 'react';
import Webcam from "react-webcam";
import 'react-toastify/dist/ReactToastify.css';
import Amplify, { API } from 'aws-amplify';

class Textract extends Component {
    constructor(props) {
        super(props);
        this.webcamRef = React.createRef()
        this.state = {
            screenshot: null,
            blocks: null,
            loading: false
        }
    }

    componentDidMount() {
    }

    async postImage() {
        
        this.setState({ loading: true });
        const res = await API.post("vrlearning","/demo/textract", {
            body: {
                image: this.state.screenshot
            }
        });
        this.setState({ loading: false });

        console.log(res);

        if (res !== null) {
            this.setState({ blocks: res.Blocks });
            var found = false;

            for (var i in res.Blocks) {
                console.log(res.Blocks[i].BlockType + ' ' + res.Blocks[i].Text);
                if (res.Blocks[i].BlockType === "WORD" && res.Blocks[i].Text  === this.props.content.answer) {
                    found = true;
                    break;
                }
            }

            if (found === true) {
                this.props.onCorrect();
            } else {
                this.props.onWrong();
            }
        }
        else {
            console.log("something wrong! try again.");
        }        
    }

    capture = () => {

        const screenshot = this.webcamRef.current.getScreenshot();
        this.setState({ screenshot }, () => {
            this.postImage();
        });
    }

    render() {

        const videoConstraints = {
            width: 400,
            height: 340,
            facingMode: "user"
        };

        const picture_url = "/assets/images/"+this.props.content.given_picture;

        return (
            <div>

                <div className="container">
                    <div className="row">
                        <div className="col-5 text-center">
                            <br />
                            <h6><i className="fas fa-question-circle"></i> &nbsp; 
                            Find the word card that matches the picture below.</h6>
                            <br />
                            <img src={picture_url} alt="apple" width="200" />

                            <br /><br />
                        </div>
                        <div className="col-7">

                            <div className="text-center">
                            <Webcam
                                ref={this.webcamRef}
                                audio={false}
                                height={340}
                                screenshotFormat="image/png"
                                width={430}
                                videoConstraints={videoConstraints}
                            />
                            
                                <br/>
                                <button id="buttonSnapshot" className="btn btn-primary mr-2" onClick={this.capture}>Take a Snapshot</button>
                                <br/>
                            
                            </div>
                            <br />
                            {this.state.loading ? <h4>Checking answer...</h4> : <h4>&nbsp;</h4>}
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Textract;
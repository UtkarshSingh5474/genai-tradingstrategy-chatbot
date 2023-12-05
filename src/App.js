import React from "react";
import "./App.css";
import ChatBot from "react-simple-chatbot";
import { getResponse, test } from "./libs/api";
import "bootstrap/dist/css/bootstrap.min.css";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { Toast } from "react-toastify/dist/components";

var chatbotKey = 0; // Key to trigger re-render

class Chatbot extends React.Component {
  // State to manage user information and past orders
  state = {
    chatbotKey: chatbotKey,
  };

  resetChatbot= () =>  {
    console.log("RESET CHATBOT");
    this.setState({
      chatbotKey: this.state.chatbotKey + 1, // Trigger re-render
    });
  }

  render() {
    // Chatbot steps configuration
    const steps = [
      {
        id: "1",
        message:
          "Hello, I am Trading Strategy Bot. I can analyse any company's financial data.",
        trigger: "2",
      },
      {
        id: "2",
        message: "Please enter the Company name",
        trigger: "userInput",
      },
      {
        id: "companyNameInput",
        user: true,
        trigger: "3",
      },
      {
        id: "3",
        message: "Please enter the Company Stock Symbol",
        trigger: "tickerInput",
      },
      {
        id: "tickerInput",
        user: true,
        trigger: "sendCompanyInfo",
      },
      {
        id: "sendCompanyInfo",
        component: <SendCompanyInfoStep resetChatbot={this.resetChatbot}/>,
        asMessage: true,
        waitAction: true,
        trigger: "userInput",
      },
      {
        id: "userInput",
        user: true,
        trigger: "getResponse",
      },
      {
        id: "getResponse",
        component: <ApiResponseStep resetChatbot={this.resetChatbot}/>,
        asMessage: true,
        waitAction: true,
        trigger: "userInput",
      }
    ];

    // Render the Chatbot component
    return (
      <div className="root">
        {/* <ToastContainer /> */}

        <div className="chatbot-container">
          <ChatBot
            key={this.state.chatbotKey}
            // Chatbot configuration
            submitButtonStyle={{ backgroundColor: "#176379",fill:"#ffffff" }}
            bubbleStyle={{ backgroundColor: "#3293AE",fontSize:"18px",color:"#ffffff" }}
            botAvatar="https://yt3.googleusercontent.com/naqldVcm_C0TBDBkGB9rah74wdDQKOa7qGcn-FimmkbVQUzlHhJ5vn8UOYZjF38yHJRfNLlT-FE=s900-c-k-c0x00ffffff-no-rj"
            headerTitle="Trading Strategy Bot"
            className="chatbot"
            hideHeader={false}
            customStyle={{
              // Apply custom styles for the chatbot container
              background: "transparent", // Completely transparent background
              boxShadow: "none", // No box shadow
              border: "none", // No border
            }}
            style={{
              height: "90vh", // Increase the height for desktop
              width: "100%", // Adjust the width to your preference
              margin: "0 auto", // Center horizontally
            }}
            steps={steps}
            handleEnd={() => console.log("Chat ended")}
          />
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Due to trial credits of OpenAI API and GCP the response is slow.
            (Estimate waiting time : 1-2mins)
          </p>
          <p
            style={{
              textAlign: "center",
              fontStyle: "italic",
              fontWeight: "bold",
              margin: "-15px"
            }}
          >
            Disclaimer: The information provided is generated using AI algorithms which may or may not be correct and does not reflect the opinions or views of any specific individual.
          </p>
        </div>
      </div>
    );
  }
}

// Component for displaying API response
class ApiResponseStep extends React.Component {
  state = {
    message: "...",
  };

  async componentDidMount() {
    console.log("APIRESPONSESTEP");
    const { previousStep, triggerNextStep } = this.props;

    if (previousStep.value ==="@@clear") {
      console.log("clearing");
      this.props.resetChatbot();
      getResponse("@@clear").then((response) => {console.log(response);});
      return;
    }

    getResponse(previousStep.value).then((response) => {
      console.log("response:", response);
      this.setState({ message: response }, () => {
        // Trigger next step for user input
        triggerNextStep({
          trigger: "userInput",
        });
      });
    });
  }

  render() {
    return (
      <div className="responseMessage">
        <div dangerouslySetInnerHTML={{ __html: this.state.message }} />
      </div>
    );
  }
}

class SendCompanyInfoStep extends React.Component {
  state = {
    message:
      "Gathering information about " + this.props.steps.companyNameInput.value,
    companyNameInput: "",
    tickerInput: "",
  };

  async componentDidMount() {
    console.log("SENDCOMPANYINFOSTEP");

    const { steps } = this.props;
    const { companyNameInput, tickerInput } = steps;
    const { triggerNextStep } = this.props;
    this.setState({ companyNameInput, tickerInput });
    if (tickerInput.value ==="@@clear") {
      this.props.resetChatbot();
      getResponse("@@clear").then((response) => {console.log(response);});
      return;
    }

    getResponse(companyNameInput.value + "@@" + tickerInput.value).then(
      (response) => {
        console.log("responseSendCompanyInfo:", response);

        this.setState({ message: response }, () => {
          // Trigger next step for user input
          triggerNextStep({
            trigger: "userInput",
          });
        });
      }
    );
  }

  render() {
    return (
      <div className="responseMessage">
        <div dangerouslySetInnerHTML={{ __html: this.state.message }} />
      </div>
    );
  }
}

export default Chatbot;

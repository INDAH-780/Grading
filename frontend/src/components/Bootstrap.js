import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function Bootstrap() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Example textarea</Form.Label>
        <Form.Control as="textarea" rows={3} />
      </Form.Group>
      <Button variant="primary">Primary</Button>{" "}
    </Form>
  );
}

export default Bootstrap;

 const handleSubmit = async () => {
   const submissionData = { essay: essay.trim() === "" ? "N/A" : essay };

   try {
     const { data } = await axios.post(
       "http://localhost:5000/api/submit",
       submissionData
     );
     navigate("/result", {
       state: {
         gradingResults: data,
         question: questionText,
         userAnswer: submissionData.essay,
       },
     });
   } catch (error) {
     console.error("Error submitting essay:", error);
   }
 };
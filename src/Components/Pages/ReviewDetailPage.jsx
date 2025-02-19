import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Divider,
  Spin,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { useUser } from "../../UserContext/useUser";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ReviewerDetailsPage = () => {
  const { ideaId } = useParams();
  const navigate = useNavigate();
  const { loggedInUser } = useUser();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [form] = Form.useForm();

  // Fetch idea details on mount
  useEffect(() => {
    fetch(`http://localhost:5001/ideasdata/${ideaId}`)
      .then((response) => response.json())
      .then((data) => {
        setIdea(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching idea details:", error);
        message.error("Failed to fetch idea details");
        setLoading(false);
      });
  }, [ideaId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!idea) {
    return <Text type="danger">Idea not found</Text>;
  }

  // Function to get today's date in YYYY-MM-DD format
  const getFormattedDate = () => new Date().toISOString().split("T")[0];

  // Handle review submission with decision: "Approved" or "Rejected"
  const handleReviewSubmit = (decision) => {
    form
      .validateFields()
      .then((values) => {
        setSubmitting(true);

        // Retrieve current reviewer's info from user context
        const currentReviewerId = loggedInUser.user_id;
        const currentReviewerName = loggedInUser.name;

        // If decision is "Approved", prevent multiple approvals from the same reviewer.
        if (decision === "Approved") {
          const alreadyApproved = idea.reviewerDetails?.find(
            (review) =>
              review.reviewerId === currentReviewerId &&
              review.decision === "Approved"
          );
          if (alreadyApproved) {
            message.warning("You have already approved this idea.");
            setSubmitting(false);
            return;
          }
        }

        // Create a new review object
        const newReview = {
          id: String(Date.now()), // generate a unique ID based on timestamp
          reviewerId: currentReviewerId,
          name: currentReviewerName,
          comments: values.reviewComment,
          approvedDate: getFormattedDate(),
          decision: decision, // "Approved" or "Rejected"
        };

        // Append the new review to the existing reviewerDetails array (or create a new array)
        const updatedReviewerDetails = idea.reviewerDetails
          ? [...idea.reviewerDetails, newReview]
          : [newReview];

        // Increase acceptedCount if approved and not already approved by this reviewer
        let updatedAcceptedCount = Number(idea.acceptedCount || 0);
        if (decision === "Approved") {
          updatedAcceptedCount += 1;
        }

        // Update idea status based on decision (customize logic as needed)
        const updatedStatus = decision === "Approved" ? "Approved" : "Rejected";

        const updatedIdea = {
          ...idea,
          status: updatedStatus,
          acceptedCount: updatedAcceptedCount,
          reviewerDetails: updatedReviewerDetails,
        };

        // Update the idea record on JSON Server via a PUT request
        fetch(`http://localhost:5001/ideasdata/${ideaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedIdea),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to update review");
            }
            message.success(
              `Idea ${
                decision === "Approved" ? "accepted" : "rejected"
              } successfully!`
            );
            setIdea(updatedIdea);
            setSubmitting(false);
            // After a successful review submission, navigate to the approved idea list.
            navigate("/reviewer-dashboard/approvedIdeas");
          })
          .catch((error) => {
            console.error("Error updating review:", error);
            message.error("Error updating review");
            setSubmitting(false);
          });
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <div className="review-details-page" style={{ padding: 20 }}>
      <Card>
        {/* User Information */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>User Information</Title>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Name: </Text>
            <Text>{idea.username}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Email: </Text>
            <Text>{idea.email}</Text>
          </Col>
          <Col xs={24} md={12}>
            <Text strong>Published Date: </Text>
            <Text>{idea.publishedDate}</Text>
          </Col>
        </Row>

        <Divider />

        {/* Innovation Details */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Innovation Details</Title>
          </Col>
          <Col xs={24}>
            <Text strong>Title: </Text>
            <Text>{idea.title}</Text>
          </Col>
          <Col xs={24}>
            <Text strong>Description: </Text>
            <div
              className="idea-description"
              dangerouslySetInnerHTML={{ __html: idea.description }}
            />
          </Col>
          <Col xs={24}>
            <Text strong>Category: </Text>
            <Text>{idea.category}</Text>
          </Col>
          <Col xs={24}>
            <Text strong>Attachments: </Text>
            {idea.files && idea.files.length > 0 ? (
              <div className="attachments-container">
                {idea.files.map((file, index) => (
                  <div key={index} className="attachment-item">
                    {file.type && file.type.startsWith("image") ? (
                      // For images (including GIFs)
                      <img
                        src={file.url}
                        alt={file.name || "Uploaded Image"}
                        className="uploaded-image"
                      />
                    ) : file.type && file.type.includes("pdf") ? (
                      // For PDFs, embed using an <object>
                      <object
                        data={file.url}
                        type="application/pdf"
                        width="100%"
                        height="400px"
                      >
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name ? file.name : "View File"}
                        </a>
                      </object>
                    ) : (
                      // For other file types (e.g., zip, doc), display a download/view link
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.name ? file.name : "Download File"}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Text>No attachments</Text>
            )}
          </Col>
        </Row>

        <Divider />

        {/* Review Form */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={4}>Submit Your Review</Title>
            <Form form={form} layout="vertical">
              <Form.Item
                label="Review Comments"
                name="reviewComment"
                rules={[
                  { required: true, message: "Please add your review comments" },
                ]}
              >
                <TextArea rows={4} placeholder="Enter your review comments here" />
              </Form.Item>
              <Form.Item>
                <div className="review-buttons">
                  <Button
                    type="primary"
                    onClick={() => {
                      setSelectedDecision("Approved");
                      handleReviewSubmit("Approved");
                    }}
                    loading={submitting}
                    // Disable Reject if Approved decision is selected
                    disabled={selectedDecision === "Rejected" || submitting}
                  >
                    Accept
                  </Button>
                  <Button
                    type="default"
                    onClick={() => {
                      setSelectedDecision("Rejected");
                      handleReviewSubmit("Rejected");
                    }}
                    loading={submitting}
                    // Disable Accept if Rejected decision is selected
                    disabled={selectedDecision === "Approved" || submitting}
                  >
                    Reject
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReviewerDetailsPage;

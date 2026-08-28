const COMPLAINT_WORKFLOW_KEY = "amar-sohor-complaint-workflow";

function readWorkflow() {
  try {
    return JSON.parse(localStorage.getItem(COMPLAINT_WORKFLOW_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getComplaintWorkflow(reportId) {
  return readWorkflow()[String(reportId)] || {};
}

export function saveComplaintWorkflow(reportId, workflow) {
  const workflows = readWorkflow();
  workflows[String(reportId)] = {
    ...workflows[String(reportId)],
    ...workflow
  };
  localStorage.setItem(COMPLAINT_WORKFLOW_KEY, JSON.stringify(workflows));
}

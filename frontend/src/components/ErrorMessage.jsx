function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error">
      <p>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;

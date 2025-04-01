import ErrorPage from '../../pages/ErrorPage';

export const ForbiddenPage = () => (
  <ErrorPage 
    code="403"
    title="Доступ запрещен."
    description="У вас нет прав для доступа к этой странице."
    buttonColor="orange"
    decorationColors={{
      primary: 'red-700',
      secondary: 'red-600'
    }}
    decorationGradient="from-red-500 to-red-800"
  />
);

export default ForbiddenPage;
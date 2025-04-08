import ErrorPage from '../components/shared/error-section';

export const NotFoundPage = () => (
  <ErrorPage 
    code="404"
    title="Ой! Мы не нашли такой страницы."
    description="Возможно, она была перемещена или удалена."
    buttonColor="purple"
    backgroundGradient="from-slate-900 via-slate-800 to-slate-900"
    decorationColors={{
      primary: 'purple-700',
      secondary: 'indigo-600'
    }}
    decorationGradient="from-purple-500 to-indigo-500"
  />
);

export default NotFoundPage;
export const styles = (theme, isTitleBold) => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
    },

    title: {
        fontWeight: isTitleBold ? 500 : 400
    }
});
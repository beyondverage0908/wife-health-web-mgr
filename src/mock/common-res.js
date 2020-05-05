export const success = {
    code: '0',
    data: true,
    message: 'success',
    success: true
};

export const getSuccess = function(data) {
    return {
        code: '0',
        data,
        message: 'success',
        success: true
    };
};

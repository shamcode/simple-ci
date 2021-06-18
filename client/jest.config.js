module.exports = {
    'projects': [
        {
            'displayName': 'test',
            'moduleFileExtensions': [
                'js',
                'json',
                'sfc'
            ],
            'transform': {
                '^.+\\.sht$': 'sham-ui-templates-jest-preprocessor',
                '^.+\\.sfc$': 'sham-ui-templates-jest-preprocessor',
                '^.+\\.js$': 'sham-ui-macro-jest-preprocessor'
            },
            'transformIgnorePatterns': [],
            'collectCoverageFrom': [
                'src/**/*.js'
            ],
            'coveragePathIgnorePatterns': [
                '^.+\\.sht$',
                '<rootDir>/.babel-plugin-macrosrc.js',
                '<rootDir>/jest/globals.js'
            ],
            'testPathIgnorePatterns': [
                '<rootDir>/node_modules/',
                '<rootDir>/__tests__/integration/helpers.js'
            ],
            'setupTestFrameworkScriptFile': '<rootDir>/jest/globals.js',
            'testURL': 'http://simple-ci.example.com'
        },
        {
            'runner': 'jest-runner-eslint',
            'displayName': 'eslint',
            'moduleFileExtensions': [
                'js',
                'json',
                'sfc'
            ],
            'testMatch': [
                '<rootDir>/src/**/*.*',
                '<rootDir>/__tests__/**/*.js',
                '<rootDir>/__mocks__/**/*.js',
                '<rootDir>/jest/**/*.js'
            ],
            'testPathIgnorePatterns': [
                '<rootDir>/dist'
            ]
        },
        {
            'runner': 'jest-runner-stylelint',
            'displayName': 'stylelint',
            'moduleFileExtensions': [
                'scss'
            ],
            'testMatch': [
                '**/*.scss'
            ]
        }
    ]
};

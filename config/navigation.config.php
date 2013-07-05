<?php

return [
    'containers' => [
        'default' => [
            [
                'name' => 'home',
                'options' => [
                    'label' => 'Home',
                    'route' => 'home'
                ],
            ],
        ],
        'user' => [
            [
                'name' => 'login',
                'options' => [
                    'label' => 'Login',
                    'route' => 'zfcuser/login'
                ],
            ],
        ],
    ],
];

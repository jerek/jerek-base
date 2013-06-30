<?php
return [
    'asset_manager' => [
        'caching' => [
            'default' => [
                'cache' => 'FilePath',
                'options' => [
                    'dir' => 'public'
                ],
            ],
        ],

        'filters' => [
            'styles/style.min.css' => [
                [
                    'service' => 'JerekBase\Service\LessFactory',
                ],
            ],
        ],

        'resolver_configs' => [
            'collections' => [
                'scripts/script.min.js' => [
                    // Vendor
                    'scripts/vendor/jquery/jquery-2.0.2.min.js',
                    'scripts/vendor/jquery/jquery-ui-1.10.3.custom.ui-lightness.min.js',
                    'scripts/vendor/bootstrap/bootstrap.min.js',

                    // Mine
                    'scripts/generic/base.js',
                ],
            ],

            'paths' => [
                'jerekbase' => __DIR__ . '/../public'
            ],
        ],
    ],

    'controllers' => [
        'invokables' => [
            'JerekBase\Controller\Index' => 'JerekBase\Controller\IndexController',
        ],
    ],

    'router' => [
        'routes' => [
            'skeleton' => [
                'type'    => 'segment',
                'options' => [
                    'route'    => '/skeleton[/:action][/:id]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => 'JerekBase\Controller\Index',
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],

    'view_manager' => [
        'template_path_stack' => [
            'jerek-base' => __DIR__ . '/../view',
        ],
    ],

    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',

        'template_map' => [
            'error/404'                          => __DIR__ . '/../view/error/404.phtml',
            'error/index'                        => __DIR__ . '/../view/error/index.phtml',


            'layout/skeleton'                    => __DIR__ . '/../view/layout/skeleton.twig',
            'layout/body-classes'                => __DIR__ . '/../view/layout/body-classes.twig',
            'layout/analytics'                   => __DIR__ . '/../view/layout/analytics.twig',
            'layout/layout'                      => __DIR__ . '/../view/layout/layout.twig',
            'layout/home'                        => __DIR__ . '/../view/layout/home.twig',
            'layout/footer-simple'               => __DIR__ . '/../view/layout/footer-simple.twig',
            'layout/footer-large'                => __DIR__ . '/../view/layout/footer-large.twig',
            'layout/sidebar'                     => __DIR__ . '/../view/layout/sidebar.twig',

            'jerek-base/index/index'               => __DIR__ . '/../view/index/index.twig'
        ],

        'strategies' => [
            'ViewJsonStrategy',
        ],
    ],

    'jerekbase' => [
        'less' => [
            'paths' => [
                __DIR__ . '/../public/styles'
            ],
        ],
    ],

    'zfctwig' => [
        'environment_options' => [
            'cache' => 'data/cache/twig',
        ],

        'extensions' => [
            'JerekBase\Twig\Extension'
        ]
    ],
];

<?php
return [
    'application' => [
        'configuration' => [
            'title'                   => 'Jerek Core',
            'globalGoogleAnalyticsId' => 'UA-448886-11',
        ],
    ],

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

    'service_manager' => [
        'abstract_factories' => [
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ],
    ],

    'doctrine' => [
        'driver' => [
            'application_entities' => [
                'class' =>'Doctrine\ORM\Mapping\Driver\AnnotationDriver',
                'cache' => 'array',
                'paths' => [__DIR__ . '/../src/Application/Entity'],
            ],

            'orm_default' => [
                'drivers' => [
                    'Application\Entity' => 'application_entities',
                ],
            ],
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
            'layout/analytics'                   => __DIR__ . '/../view/layout/analytics.twig',
            'layout/layout'                      => __DIR__ . '/../view/layout/layout.twig',

            'jerek-base/index/index'               => __DIR__ . '/../view/index/index.twig'
        ],

        'template_path_stack' => [
            'jerek-base' => __DIR__ . '/../view',
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

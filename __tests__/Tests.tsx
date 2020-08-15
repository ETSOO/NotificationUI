import React from 'react';
import renderer from 'react-test-renderer';
import { NotificationUI } from '../src/NotificationUI';
import { NotificationReact } from '../src/NotificationReact';
import {
    NotificationContainer,
    NotificationType
} from '@etsoo/notificationbase';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Class implementation for tests
class NotificationReactTest extends NotificationReact {
    /**
     * Render method
     * @param className Style class name
     */
    render(className?: string) {
        return (
            <div key={this.id} className={className}>
                {this.content}
            </div>
        );
    }
}

// Timer mock
// https://jestjs.io/docs/en/timer-mocks
jest.useFakeTimers();

test('Tests for NotificationUI with react-test-renderer', () => {
    // Arrange
    // Render the UI in the document
    const ui = renderer.create(
        <NotificationUI className="test" itemClassName="item" />
    );

    // Notification object
    const notification = new NotificationReactTest(
        NotificationType.Loading,
        'Loading...'
    );
    notification.timespan = 3;

    const childrenBefore = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );

    expect(childrenBefore.length).toBe(0);

    // Rerenderer test
    // https://reactjs.org/docs/test-utils.html#act
    renderer.act(() => {
        // Add the notification
        NotificationContainer.add(notification);
    });

    // setTimeout should be called 1 time
    expect(setTimeout).toBeCalled();

    // The child added
    const children = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );
    expect(children.length).toBe(1);

    renderer.act(() => {
        // Fast forward
        // Remove the child
        jest.runOnlyPendingTimers();
    });

    const childrenNow = ui.root.findAllByProps(
        { className: 'item' },
        { deep: true }
    );

    expect(childrenNow.length).toBe(0);
});

test('Tests for NotificationUI with enzyme', () => {
    // Arrange

    // Setup adapter
    Enzyme.configure({ adapter: new Adapter() });

    // Render the UI in the document
    const ui = shallow(
        <NotificationUI className="test" itemClassName="item" />
    );

    expect(ui.children('.item').length).toBe(0);

    // Notification object
    const notification = new NotificationReactTest(
        NotificationType.Loading,
        'Loading...'
    );
    notification.timespan = 3;

    // Add the notification
    NotificationContainer.add(notification);

    ui.update();
    expect(ui.children('.item').length).toBe(1);
    expect(ui.children('.item').text()).toBe('Loading...');

    // Fast forward
    // Remove the child
    jest.runOnlyPendingTimers();

    ui.update();
    expect(ui.children('.item').length).toBe(0);
});

jest.clearAllTimers();
